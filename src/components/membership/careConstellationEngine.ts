// Imperative Three.js engine for the Care Constellation. Loaded only through a
// dynamic import from CareConstellation.tsx so three.js never ships in the
// initial bundle. Nothing here touches React state.
import {
  BufferAttribute,
  BufferGeometry,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import {
  FORMATION_EXTENT,
  FORMATION_ORDER,
  buildFormations,
  formationIndex,
  type ConstellationFormation,
} from "./constellationFormations";
import type { DeviceTier } from "./motionCapability";

export type ProgressRange = "traverse" | "contain";

export interface ConstellationEngineOptions {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  host: HTMLElement;
  progressSource: HTMLElement;
  range: ProgressRange;
  tier: DeviceTier;
  reducedMotion: boolean;
  formation?: ConstellationFormation;
  intensity: number;
  onFailure: () => void;
}

export interface ConstellationController {
  setInView(inView: boolean): void;
  setReducedMotion(reduced: boolean): void;
  setFormation(formation: ConstellationFormation | undefined): void;
  dispose(): void;
}

const TIER_SETTINGS: Record<DeviceTier, { count: number; minCount: number; maxDpr: number; size: number }> = {
  low: { count: 900, minCount: 350, maxDpr: 1.5, size: 2.8 },
  mid: { count: 1800, minCount: 600, maxDpr: 1.5, size: 2.5 },
  high: { count: 3200, minCount: 900, maxDpr: 1.75, size: 2.3 },
};

const LAST_FORMATION = FORMATION_ORDER.length - 1;
const CAMERA_Z = 7.5;
const FOV = 35;

// sRGB values passed straight to the shader (Vector3, not Color) so three's
// colour management doesn't linearise them; custom shaders output as-is.
const COLORS = {
  teal: new Vector3(0.08, 0.76, 0.62),
  mist: new Vector3(0.78, 0.86, 0.92),
  silver: new Vector3(0.77, 0.81, 0.85),
  gold: new Vector3(0.79, 0.67, 0.43),
};

const vertexShader = /* glsl */ `
  uniform float uMorph;
  uniform float uTime;
  uniform float uMotion;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec2 uField;

  attribute vec3 aSilver;
  attribute vec3 aFlow;
  attribute vec3 aGold;
  attribute vec3 aUnified;
  attribute vec4 aSeed;

  varying float vPick;
  varying float vDepth;

  vec3 formationAt(float i) {
    if (i < 0.5) return vec3(position.xy * uField, position.z);
    if (i < 1.5) return aSilver;
    if (i < 2.5) return vec3(aFlow.x * uField.x * 0.94, aFlow.yz);
    if (i < 3.5) return aGold;
    return aUnified;
  }

  void main() {
    // Each particle starts its move at a staggered point within the segment but
    // always finishes by its end, so every formation is exact at rest.
    float seg = min(floor(uMorph), 3.0);
    float span = 0.4 * uMotion;
    float f = clamp((uMorph - seg - aSeed.x * span) / (1.0 - span), 0.0, 1.0);
    f = f * f * (3.0 - 2.0 * f);
    vec3 p = mix(formationAt(seg), formationAt(seg + 1.0), f);

    float phase = aSeed.w * 6.2831853;
    p += uMotion * 0.04 * vec3(
      sin(uTime * 0.31 + phase),
      cos(uTime * 0.27 + phase * 1.3),
      sin(uTime * 0.23 + phase * 0.7)
    );

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.55 + aSeed.z * 0.9) * uPixelRatio * (${CAMERA_Z.toFixed(1)} / -mv.z);

    vPick = aSeed.y;
    vDepth = smoothstep(${(CAMERA_Z + 3.5).toFixed(1)}, ${(CAMERA_Z - 3.5).toFixed(1)}, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uTeal;
  uniform vec3 uMist;
  uniform vec3 uTint;
  uniform float uOpacity;

  varying float vPick;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.16, 0.5, d);
    vec3 col = mix(uTint, mix(uTeal, uMist, step(0.78, vPick)), step(0.42, vPick));
    float alpha = a * uOpacity * (0.35 + 0.65 * vDepth);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

// Maps scroll progress to a morph value with short rests on each formation.
function progressToMorph(progress: number): number {
  const u = Math.min(1, Math.max(0, progress)) * LAST_FORMATION;
  const seg = Math.min(Math.floor(u), LAST_FORMATION - 1);
  return seg + smoothstep(0.18, 0.82, u - seg);
}

export function createCareConstellation(options: ConstellationEngineOptions): ConstellationController | null {
  const { canvas, gl, host, progressSource, range, tier, onFailure } = options;
  const settings = TIER_SETTINGS[tier];

  canvas.setAttribute("aria-hidden", "true");
  canvas.setAttribute("role", "presentation");
  Object.assign(canvas.style, {
    display: "block",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    opacity: "0",
    transition: options.reducedMotion ? "none" : "opacity 1.4s ease-out",
  });

  let renderer: WebGLRenderer;
  try {
    // The context was created (with alpha, no depth/stencil, low-power) by the
    // caller before this module was downloaded; three reads its attributes.
    renderer = new WebGLRenderer({ canvas, context: gl, depth: false, stencil: false });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  host.appendChild(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 40);
  camera.position.set(0, 0, CAMERA_Z);

  const formations = buildFormations(settings.count);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(formations.dispersed, 3));
  geometry.setAttribute("aSilver", new BufferAttribute(formations.silver, 3));
  geometry.setAttribute("aFlow", new BufferAttribute(formations.flow, 3));
  geometry.setAttribute("aGold", new BufferAttribute(formations.gold, 3));
  geometry.setAttribute("aUnified", new BufferAttribute(formations.unified, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(formations.seeds, 4));

  const uniforms = {
    uMorph: { value: 0 },
    uTime: { value: 0 },
    uMotion: { value: options.reducedMotion ? 0 : 1 },
    uPixelRatio: { value: 1 },
    uSize: { value: settings.size },
    uField: { value: new Vector2(3, 2) },
    uTeal: { value: COLORS.teal },
    uMist: { value: COLORS.mist },
    uTint: { value: COLORS.teal.clone() },
    uOpacity: { value: 0.8 * options.intensity },
  };

  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: NormalBlending,
    premultipliedAlpha: true,
  });
  const points = new Points(geometry, material);
  // Positions are computed in the shader, so the geometry's bounds are meaningless for culling.
  points.frustumCulled = false;
  points.rotation.x = -0.08;
  scene.add(points);

  let disposed = false;
  let contextLost = false;
  let inView = false;
  let pageVisible = document.visibilityState !== "hidden";
  let reducedMotion = options.reducedMotion;
  let staticFormation = options.formation;
  let rafId = 0;
  let lastFrame = 0;
  let hasRendered = false;

  let drawCount = settings.count;
  let sampleFrames = 0;
  let sampleTime = 0;

  let sourceTop = 0;
  let sourceHeight = 1;
  let viewportW = window.innerWidth;
  let viewportH = window.innerHeight;

  function staticMorph(): number {
    return formationIndex(staticFormation ?? "unified");
  }

  function readProgress(): number {
    const scrollY = window.scrollY;
    const p =
      range === "contain"
        ? (scrollY - sourceTop) / Math.max(1, sourceHeight - viewportH)
        : (scrollY + viewportH - sourceTop) / Math.max(1, sourceHeight + viewportH);
    return Math.min(1, Math.max(0, p));
  }

  function targetMorph(): number {
    if (reducedMotion || staticFormation) return staticMorph();
    return progressToMorph(readProgress());
  }

  function updateTint(morph: number) {
    const s = Math.max(0, 1 - Math.abs(morph - 1));
    const g = Math.max(0, 1 - Math.abs(morph - 3));
    const tint = uniforms.uTint.value;
    tint.copy(COLORS.teal).multiplyScalar(1 - s - g);
    tint.addScaledVector(COLORS.silver, s).addScaledVector(COLORS.gold, g);
  }

  function render() {
    renderer.render(scene, camera);
    if (!hasRendered) {
      hasRendered = true;
      canvas.style.opacity = "1";
    }
  }

  function renderStatic() {
    if (disposed) return;
    const morph = staticMorph();
    uniforms.uMorph.value = morph;
    uniforms.uMotion.value = 0;
    updateTint(morph);
    render();
  }

  // Page-level layout is cached and only re-measured when something resizes,
  // so the frame loop reads window.scrollY and never forces layout.
  function measureSource() {
    const rect = progressSource.getBoundingClientRect();
    sourceTop = rect.top + window.scrollY;
    sourceHeight = rect.height;
  }

  function resizeCanvas() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    uniforms.uPixelRatio.value = dpr;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const halfH = CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
    const halfW = halfH * camera.aspect;
    const fit = Math.min(1, (halfW * 0.92) / FORMATION_EXTENT, (halfH * 0.95) / FORMATION_EXTENT);
    points.scale.setScalar(fit);
    uniforms.uField.value.set((halfW * 1.02) / fit, (halfH * 1.02) / fit);

    if (reducedMotion) renderStatic();
  }

  // Ignore height-only changes from Safari's collapsing address bar; they would
  // otherwise nudge scroll progress mid-gesture.
  function onWindowResize() {
    const widthChanged = window.innerWidth !== viewportW;
    const bigHeightChange = Math.abs(window.innerHeight - viewportH) > 140;
    if (!widthChanged && !bigHeightChange) return;
    viewportW = window.innerWidth;
    viewportH = window.innerHeight;
    measureSource();
  }

  function adaptDensity(dt: number) {
    if (drawCount <= settings.minCount) return;
    sampleFrames++;
    if (sampleFrames <= 20) return;
    sampleTime += dt;
    if (sampleFrames < 140) return;
    const avg = sampleTime / (sampleFrames - 20);
    if (avg > 1 / 45) {
      drawCount = Math.max(settings.minCount, Math.floor(drawCount * 0.65));
      geometry.setDrawRange(0, drawCount);
    }
    sampleFrames = 0;
    sampleTime = 0;
  }

  function frame(now: number) {
    rafId = 0;
    if (!shouldAnimate()) return;

    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 1 / 60;
    lastFrame = now;

    const target = targetMorph();
    const current = uniforms.uMorph.value;
    uniforms.uMorph.value = current + (target - current) * (1 - Math.exp(-dt * 2.4));
    uniforms.uTime.value += dt;
    uniforms.uMotion.value = Math.min(1, uniforms.uMotion.value + dt);
    updateTint(uniforms.uMorph.value);
    points.rotation.y += dt * 0.03;

    render();
    adaptDensity(dt);
    rafId = requestAnimationFrame(frame);
  }

  function shouldAnimate(): boolean {
    return !disposed && inView && pageVisible && !reducedMotion;
  }

  function syncLoop() {
    if (shouldAnimate()) {
      if (!rafId) {
        lastFrame = 0;
        rafId = requestAnimationFrame(frame);
      }
    } else if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function onVisibilityChange() {
    pageVisible = document.visibilityState !== "hidden";
    syncLoop();
  }

  function onContextLost(event: Event) {
    event.preventDefault();
    contextLost = true;
    controller.dispose();
    onFailure();
  }

  const hostObserver = new ResizeObserver(resizeCanvas);
  const layoutObserver = new ResizeObserver(measureSource);
  hostObserver.observe(host);
  layoutObserver.observe(progressSource);
  layoutObserver.observe(document.body);
  window.addEventListener("resize", onWindowResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  canvas.addEventListener("webglcontextlost", onContextLost);

  measureSource();
  resizeCanvas();
  uniforms.uMorph.value = targetMorph();
  updateTint(uniforms.uMorph.value);
  // Compile now rather than inside the first scroll-synced animation frame.
  renderer.compile(scene, camera);
  if (reducedMotion) renderStatic();

  const controller: ConstellationController = {
    setInView(value) {
      inView = value;
      syncLoop();
    },
    setReducedMotion(value) {
      if (value === reducedMotion) return;
      reducedMotion = value;
      canvas.style.transition = value ? "none" : "opacity 1.4s ease-out";
      if (value) renderStatic();
      syncLoop();
    },
    setFormation(value) {
      staticFormation = value;
      if (reducedMotion) renderStatic();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      hostObserver.disconnect();
      layoutObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      // Release the GL context immediately; iOS caps live contexts per page.
      if (!contextLost) renderer.forceContextLoss();
      canvas.remove();
    },
  };

  return controller;
}
