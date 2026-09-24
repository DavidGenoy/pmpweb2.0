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
  Vector4,
  WebGLRenderer,
} from "three";
import {
  FORMATION_EXTENT,
  PROGRESS_SEQUENCE,
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
  // Up to two DOM elements (Silver, Gold) the "cards" formation outlines.
  anchors: HTMLElement[];
  intensity: number;
  // Formation offset as fractions of half the canvas width/height (+x right, +y up).
  offsetX: number;
  offsetY: number;
  onFailure: () => void;
}

export interface ConstellationController {
  setInView(inView: boolean): void;
  setReducedMotion(reduced: boolean): void;
  setFormation(formation: ConstellationFormation | undefined): void;
  setIntensity(intensity: number): void;
  setOffset(offsetX: number, offsetY: number): void;
  dispose(): void;
}

const TIER_SETTINGS: Record<DeviceTier, { count: number; minCount: number; maxDpr: number; size: number }> = {
  low: { count: 800, minCount: 350, maxDpr: 1.5, size: 2.6 },
  mid: { count: 1500, minCount: 600, maxDpr: 1.5, size: 2.4 },
  high: { count: 2600, minCount: 900, maxDpr: 1.75, size: 2.2 },
};

const CAMERA_Z = 7.5;
const FOV = 35;
const MORPH_SECONDS = 1.6;
const BASE_OPACITY = 0.85;

// Palette for light backgrounds. sRGB values go straight to the shader
// (Vector3, not Color) so three's colour management doesn't linearise them.
const COLORS = {
  green: new Vector3(0.0, 0.659, 0.588), // PMP accent-500 #00a896
  navy: new Vector3(0.32, 0.38, 0.48),
  silver: new Vector3(0.49, 0.55, 0.64),
  gold: new Vector3(0.69, 0.54, 0.28),
};

const i = (name: ConstellationFormation) => `${formationIndex(name)}.0`;

const vertexShader = /* glsl */ `
  uniform float uFrom;
  uniform float uTo;
  uniform float uT;
  uniform float uTime;
  uniform float uMotion;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec2 uOffset;
  uniform vec2 uField;
  uniform vec3 uGreen;
  uniform vec3 uSilver;
  uniform vec3 uGold;
  uniform vec4 uCardA;
  uniform vec4 uCardB;
  uniform float uCardRadius;
  uniform float uPxWorld;
  uniform float uShare;
  uniform vec2 uAttn;

  attribute vec3 aFlow;
  attribute vec3 aUnified;
  attribute vec3 aFamily;
  attribute vec4 aPerim;
  attribute vec4 aSeed;

  varying float vPick;
  varying float vDepth;
  varying float vAlpha;
  varying vec3 vTint;

  float gCardW;
  float gCardAttn;

  vec3 shapeAt(float i) {
    if (i < ${i("dispersed")} + 0.5) return vec3(position.xy * uField, position.z);
    if (i < ${i("flow")} + 0.5) return vec3(aFlow.x * uField.x * 0.94, aFlow.yz);
    if (i < ${i("unified")} + 0.5) return aUnified;
    return aFamily;
  }

  // Point on a rounded rectangle (centre c, half size h, radius r) at
  // parameter u; corners get extra weight so particles gather there slightly.
  // Returns position (xy) and outward normal (zw).
  vec4 roundedRect(vec2 c, vec2 h, float r, float u) {
    r = min(r, min(h.x, h.y));
    float ex = 2.0 * (h.x - r);
    float ey = 2.0 * (h.y - r);
    float arc = 1.5707963 * r * 1.7;
    float s = fract(u) * (2.0 * ex + 2.0 * ey + 4.0 * arc);
    vec2 n;
    if (s < ex) return vec4(c + vec2(-h.x + r + s, h.y), 0.0, 1.0);
    s -= ex;
    if (s < arc) { n = vec2(sin(1.5707963 * s / arc), cos(1.5707963 * s / arc)); return vec4(c + vec2(h.x - r, h.y - r) + n * r, n); }
    s -= arc;
    if (s < ey) return vec4(c + vec2(h.x, h.y - r - s), 1.0, 0.0);
    s -= ey;
    if (s < arc) { n = vec2(cos(1.5707963 * s / arc), -sin(1.5707963 * s / arc)); return vec4(c + vec2(h.x - r, -h.y + r) + n * r, n); }
    s -= arc;
    if (s < ex) return vec4(c + vec2(h.x - r - s, -h.y), 0.0, -1.0);
    s -= ex;
    if (s < arc) { n = vec2(-sin(1.5707963 * s / arc), -cos(1.5707963 * s / arc)); return vec4(c + vec2(-h.x + r, -h.y + r) + n * r, n); }
    s -= arc;
    if (s < ey) return vec4(c + vec2(-h.x, -h.y + r + s), -1.0, 0.0);
    s -= ey;
    n = vec2(-cos(1.5707963 * s / arc), sin(1.5707963 * s / arc));
    return vec4(c + vec2(-h.x + r, h.y - r) + n * r, n);
  }

  // World-space position around the Silver (A) and Gold (B) card perimeters.
  // uShare is the fraction of particles attending Gold; particles near the
  // threshold are in transit and arc softly between the two cards.
  vec3 cardsWorld() {
    float pick = fract(aPerim.x * 17.0 + aSeed.w * 7.13);
    gCardW = 1.0 - smoothstep(uShare - 0.05, uShare + 0.05, pick);
    gCardAttn = mix(uAttn.x, uAttn.y, gCardW);

    float u = aPerim.x + uTime * aPerim.y;
    float stray = aPerim.w * (0.5 + 0.5 * sin(uTime * 0.21 + aSeed.w * 6.2831853)) * 30.0;
    float loose = mix(1.8, 1.0, gCardAttn);
    float offset = (aPerim.z * loose + stray) * uPxWorld;

    vec4 a = roundedRect(uCardA.xy, uCardA.zw, uCardRadius, u);
    vec4 b = roundedRect(uCardB.xy, uCardB.zw, uCardRadius, u + 0.37);
    vec2 pa = a.xy + a.zw * offset;
    vec2 pb = b.xy + b.zw * offset;
    vec2 p = mix(pa, pb, gCardW);

    vec2 d = pb - pa;
    float len = length(d);
    if (len > 1e-4) p += vec2(-d.y, d.x) / len * sin(3.1415926 * gCardW) * (aSeed.z - 0.5) * len * 0.35;

    float wobble = uMotion * 1.5 * uPxWorld;
    p += vec2(sin(uTime * 0.7 + aSeed.w * 40.0), cos(uTime * 0.6 + aSeed.y * 40.0)) * wobble;
    return vec3(p, (aSeed.x - 0.5) * 0.2);
  }

  vec3 viewAt(float i, vec3 cards) {
    if (i > ${i("cards")} - 0.5) return (viewMatrix * vec4(cards, 1.0)).xyz;
    vec3 p = shapeAt(i);
    p.xy += uOffset;
    float phase = aSeed.w * 6.2831853;
    p += uMotion * 0.04 * vec3(
      sin(uTime * 0.31 + phase),
      cos(uTime * 0.27 + phase * 1.3),
      sin(uTime * 0.23 + phase * 0.7)
    );
    return (modelViewMatrix * vec4(p, 1.0)).xyz;
  }

  vec3 tintAt(float i) {
    if (i > ${i("cards")} - 0.5) return mix(uSilver, uGold, gCardW);
    if (i > ${i("family")} - 0.5) return uGold;
    return uGreen;
  }

  float alphaAt(float i) {
    return i > ${i("cards")} - 0.5 ? mix(0.5, 1.0, gCardAttn) : 1.0;
  }

  void main() {
    gCardW = 0.0;
    gCardAttn = 1.0;
    vec3 cards = (uFrom > ${i("cards")} - 0.5 || uTo > ${i("cards")} - 0.5) ? cardsWorld() : vec3(0.0);

    // Each particle starts its move at a staggered point but always finishes by
    // the end of the transition, so every formation is exact at rest.
    float span = 0.4 * uMotion;
    float f = clamp((uT - aSeed.x * span) / (1.0 - span), 0.0, 1.0);
    f = f * f * (3.0 - 2.0 * f);

    vec3 mv = mix(viewAt(uFrom, cards), viewAt(uTo, cards), f);
    gl_Position = projectionMatrix * vec4(mv, 1.0);
    gl_PointSize = uSize * (0.55 + aSeed.z * 0.9) * uPixelRatio * (${CAMERA_Z.toFixed(1)} / -mv.z);

    vPick = aSeed.y;
    vTint = mix(tintAt(uFrom), tintAt(uTo), f);
    vAlpha = mix(alphaAt(uFrom), alphaAt(uTo), f);
    vDepth = smoothstep(${(CAMERA_Z + 3.5).toFixed(1)}, ${(CAMERA_Z - 3.5).toFixed(1)}, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uGreen;
  uniform vec3 uNavy;
  uniform float uOpacity;

  varying float vPick;
  varying float vDepth;
  varying float vAlpha;
  varying vec3 vTint;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.16, 0.5, d);
    // Mostly the formation tint, a minority of PMP green, a few navy accents.
    vec3 col = mix(vTint, mix(uGreen, uNavy, step(0.9, vPick)), step(0.66, vPick));
    float alpha = a * uOpacity * vAlpha * (0.4 + 0.6 * vDepth);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

function smoothstep(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

// Maps scroll progress to a position along PROGRESS_SEQUENCE with short rests
// on each formation.
function progressToSequence(progress: number): number {
  const last = PROGRESS_SEQUENCE.length - 1;
  const u = Math.min(1, Math.max(0, progress)) * last;
  const seg = Math.min(Math.floor(u), last - 1);
  return seg + smoothstep(0.18, 0.82, u - seg);
}

const damp = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-dt * rate));

// Layout position in page coordinates. Uses offset* so in-flight CSS
// transforms (scroll reveals, press feedback) don't skew the cached geometry.
function pagePosition(el: HTMLElement): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

interface CachedRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function createCareConstellation(options: ConstellationEngineOptions): ConstellationController | null {
  const { canvas, gl, host, progressSource, range, tier, onFailure } = options;
  const anchors = options.anchors.slice(0, 2);
  const settings = TIER_SETTINGS[tier];
  // The canvas host sits in a sticky holder inside the absolutely positioned layer.
  const holder = host.parentElement ?? host;
  const layer = holder.parentElement ?? holder;

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
    // The context was created (with alpha, no depth/stencil, no antialias,
    // low-power) by the caller before this module was downloaded.
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
  geometry.setAttribute("aFlow", new BufferAttribute(formations.flow, 3));
  geometry.setAttribute("aUnified", new BufferAttribute(formations.unified, 3));
  geometry.setAttribute("aFamily", new BufferAttribute(formations.family, 3));
  geometry.setAttribute("aPerim", new BufferAttribute(formations.perimeter, 4));
  geometry.setAttribute("aSeed", new BufferAttribute(formations.seeds, 4));

  const uniforms = {
    uFrom: { value: 0 },
    uTo: { value: 0 },
    uT: { value: 1 },
    uTime: { value: 0 },
    uMotion: { value: options.reducedMotion ? 0 : 1 },
    uPixelRatio: { value: 1 },
    uSize: { value: settings.size },
    uOffset: { value: new Vector2(0, 0) },
    uField: { value: new Vector2(3, 2) },
    uGreen: { value: COLORS.green },
    uNavy: { value: COLORS.navy },
    uSilver: { value: COLORS.silver },
    uGold: { value: COLORS.gold },
    uCardA: { value: new Vector4(0, 0, 1, 1) },
    uCardB: { value: new Vector4(0, 0, 1, 1) },
    uCardRadius: { value: 0.1 },
    uPxWorld: { value: 0.01 },
    uShare: { value: 0.5 },
    uAttn: { value: new Vector2(1, 1) },
    uOpacity: { value: BASE_OPACITY * options.intensity },
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
  let rafId = 0;
  let staticRafId = 0;
  let lastFrame = 0;
  let hasRendered = false;

  // Formation mode: move from -> to over MORPH_SECONDS; a newer request waits
  // for the current move to finish so positions never jump.
  let requested: ConstellationFormation | undefined = options.formation;
  let fromName: ConstellationFormation = "dispersed";
  let toName: ConstellationFormation = options.formation ?? "dispersed";
  let t = toName === "dispersed" ? 1 : 0;
  let sequencePos = 0;

  let intensity = options.intensity;
  // Offset is tracked as fractions of the half canvas size and eased toward its
  // goal; the formation scale shrinks with it so shifted shapes never clip.
  const offsetGoal = new Vector2(options.offsetX, options.offsetY);
  const offsetNow = offsetGoal.clone();
  let canvasW = 1;
  let canvasH = 1;
  let halfW = 1;
  let halfH = 1;
  let fit = 1;
  let fitGoal = 1;

  let drawCount = settings.count;
  let sampleFrames = 0;
  let sampleTime = 0;

  // Cached page geometry, refreshed only when something resizes.
  let sourceTop = 0;
  let sourceHeight = 1;
  let layerTop = 0;
  let layerLeft = 0;
  let layerHeight = 1;
  let holderHeight = 1;
  let cardRadiusPx = 24;
  const cardRects: CachedRect[] = anchors.map(() => ({ x: 0, y: 0, w: 1, h: 1 }));
  let viewportW = window.innerWidth;
  let viewportH = window.innerHeight;

  function readProgress(): number {
    const scrollY = window.scrollY;
    const p =
      range === "contain"
        ? (scrollY - sourceTop) / Math.max(1, sourceHeight - viewportH)
        : (scrollY + viewportH - sourceTop) / Math.max(1, sourceHeight + viewportH);
    return Math.min(1, Math.max(0, p));
  }

  function nextStep(from: ConstellationFormation, target: ConstellationFormation): ConstellationFormation {
    // Moving between the card outlines and a centred shape reads best when it
    // passes through the loose field first.
    const centred = (name: ConstellationFormation) => name === "unified" || name === "family";
    if ((from === "cards" && centred(target)) || (target === "cards" && centred(from))) return "dispersed";
    return target;
  }

  function applyMorph() {
    uniforms.uFrom.value = formationIndex(fromName);
    uniforms.uTo.value = formationIndex(toName);
    uniforms.uT.value = t;
  }

  function updateFitGoal() {
    const ox = Math.min(Math.abs(offsetGoal.x), 0.6);
    const oy = Math.min(Math.abs(offsetGoal.y), 0.6);
    fitGoal = Math.min(1, (halfW * (0.92 - ox)) / FORMATION_EXTENT, (halfH * (0.95 - oy)) / FORMATION_EXTENT);
  }

  function applyLayout() {
    points.scale.setScalar(fit);
    uniforms.uField.value.set((halfW * 1.02) / fit, (halfH * 1.02) / fit);
    uniforms.uOffset.value.set((offsetNow.x * halfW) / fit, (offsetNow.y * halfH) / fit);
  }

  // Converts the cached card rects to world space for the current scroll
  // position (no layout reads) and derives how much attention each card has.
  function updateCards(dt: number | null) {
    if (cardRects.length === 0) return;
    const scrollY = window.scrollY;
    // Viewport y of the sticky canvas holder, clamped to its layer like CSS sticky.
    const holderTop = Math.min(Math.max(layerTop - scrollY, 0), layerTop + layerHeight - holderHeight - scrollY);
    const pxWorld = (2 * halfH) / canvasH;
    uniforms.uPxWorld.value = pxWorld;
    uniforms.uCardRadius.value = cardRadiusPx * pxWorld;

    const attention = [0, 0];
    cardRects.forEach((rect, index) => {
      const cx = rect.x - layerLeft + rect.w / 2;
      const cyViewport = rect.y - scrollY + rect.h / 2;
      const cy = cyViewport - holderTop;
      const target = index === 0 ? uniforms.uCardA.value : uniforms.uCardB.value;
      target.set((cx - canvasW / 2) * pxWorld, -(cy - canvasH / 2) * pxWorld, (rect.w / 2) * pxWorld, (rect.h / 2) * pxWorld);
      const distance = Math.abs(cyViewport - viewportH * 0.5) / (viewportH * 0.5 + rect.h * 0.5);
      attention[index] = 1 - smoothstep(0.3, 1, distance);
    });
    if (cardRects.length === 1) {
      uniforms.uCardB.value.copy(uniforms.uCardA.value);
      attention[1] = attention[0];
    }

    const total = attention[0] + attention[1];
    const share = total > 0.02 ? 0.12 + 0.76 * (attention[1] / total) : uniforms.uShare.value;
    const attn = uniforms.uAttn.value;
    if (dt === null) {
      uniforms.uShare.value = share;
      attn.set(attention[0], attention[1]);
    } else {
      uniforms.uShare.value = damp(uniforms.uShare.value, share, 2.2, dt);
      attn.set(damp(attn.x, attention[0], 2.5, dt), damp(attn.y, attention[1], 2.5, dt));
    }
  }

  function advance(dt: number) {
    if (requested) {
      if (t >= 1 && requested !== toName) {
        fromName = toName;
        toName = nextStep(fromName, requested);
        t = 0;
      }
      t = Math.min(1, t + dt / MORPH_SECONDS);
    } else {
      sequencePos = damp(sequencePos, progressToSequence(readProgress()), 2.4, dt);
      const seg = Math.min(Math.floor(sequencePos), PROGRESS_SEQUENCE.length - 2);
      fromName = PROGRESS_SEQUENCE[seg];
      toName = PROGRESS_SEQUENCE[seg + 1];
      t = sequencePos - seg;
    }
    applyMorph();
    uniforms.uOpacity.value = damp(uniforms.uOpacity.value, BASE_OPACITY * intensity, 2, dt);
    offsetNow.set(damp(offsetNow.x, offsetGoal.x, 2.2, dt), damp(offsetNow.y, offsetGoal.y, 2.2, dt));
    fit = damp(fit, fitGoal, 2.2, dt);
    applyLayout();
    updateCards(dt);
  }

  function render() {
    renderer.render(scene, camera);
    if (!hasRendered) {
      hasRendered = true;
      canvas.style.opacity = "1";
    }
  }

  // Reduced motion: jump straight to the resting state and draw one frame.
  function renderStatic() {
    if (disposed) return;
    fromName = toName = requested ?? "unified";
    t = 1;
    applyMorph();
    uniforms.uMotion.value = 0;
    uniforms.uOpacity.value = BASE_OPACITY * intensity;
    offsetNow.copy(offsetGoal);
    fit = fitGoal;
    applyLayout();
    updateCards(null);
    render();
  }

  // With reduced motion there is no loop, but card outlines must stay attached
  // to their cards while the page scrolls, so redraw (at most once per frame).
  function onScroll() {
    if (!reducedMotion || !inView || staticRafId || disposed) return;
    staticRafId = requestAnimationFrame(() => {
      staticRafId = 0;
      renderStatic();
    });
  }

  function measure() {
    const source = progressSource.getBoundingClientRect();
    sourceTop = source.top + window.scrollY;
    sourceHeight = source.height;

    const layerPos = pagePosition(layer);
    layerTop = layerPos.y;
    layerLeft = layerPos.x;
    layerHeight = layer.offsetHeight;
    holderHeight = holder.offsetHeight;

    anchors.forEach((el, index) => {
      const pos = pagePosition(el);
      cardRects[index] = { x: pos.x, y: pos.y, w: el.offsetWidth, h: el.offsetHeight };
    });
    if (anchors[0]) cardRadiusPx = parseFloat(getComputedStyle(anchors[0]).borderTopLeftRadius) || 24;
    if (reducedMotion && hasRendered) renderStatic();
  }

  function resizeCanvas() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (width === 0 || height === 0) return;
    canvasW = width;
    canvasH = height;

    const dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    uniforms.uPixelRatio.value = dpr;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    halfH = CAMERA_Z * Math.tan((FOV * Math.PI) / 360);
    halfW = halfH * camera.aspect;
    updateFitGoal();
    fit = fitGoal;
    applyLayout();
    measure();

    if (reducedMotion) renderStatic();
  }

  // Ignore height-only changes from Safari's collapsing address bar; they would
  // otherwise nudge scroll-derived values mid-gesture.
  function onWindowResize() {
    const widthChanged = window.innerWidth !== viewportW;
    const bigHeightChange = Math.abs(window.innerHeight - viewportH) > 140;
    if (!widthChanged && !bigHeightChange) return;
    viewportW = window.innerWidth;
    viewportH = window.innerHeight;
    measure();
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

    advance(dt);
    uniforms.uTime.value += dt;
    uniforms.uMotion.value = Math.min(1, uniforms.uMotion.value + dt);
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
  const layoutObserver = new ResizeObserver(measure);
  hostObserver.observe(host);
  layoutObserver.observe(progressSource);
  layoutObserver.observe(layer);
  layoutObserver.observe(document.body);
  anchors.forEach((el) => layoutObserver.observe(el));
  window.addEventListener("resize", onWindowResize, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  canvas.addEventListener("webglcontextlost", onContextLost);
  // Web fonts can shift card heights after first layout.
  document.fonts?.ready.then(() => !disposed && measure());

  measure();
  resizeCanvas();
  updateCards(null);
  applyMorph();
  // Compile now rather than inside the first scroll-synced animation frame.
  renderer.compile(scene, camera);
  if (reducedMotion) renderStatic();

  const controller: ConstellationController = {
    setInView(value) {
      inView = value;
      syncLoop();
      if (value && reducedMotion) renderStatic();
    },
    setReducedMotion(value) {
      if (value === reducedMotion) return;
      reducedMotion = value;
      canvas.style.transition = value ? "none" : "opacity 1.4s ease-out";
      if (value) renderStatic();
      syncLoop();
    },
    setFormation(value) {
      requested = value;
      if (reducedMotion) renderStatic();
    },
    setIntensity(value) {
      intensity = value;
      if (reducedMotion) renderStatic();
    },
    setOffset(x, y) {
      offsetGoal.set(x, y);
      updateFitGoal();
      if (reducedMotion) renderStatic();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (staticRafId) cancelAnimationFrame(staticRafId);
      rafId = staticRafId = 0;
      hostObserver.disconnect();
      layoutObserver.disconnect();
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("scroll", onScroll);
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
