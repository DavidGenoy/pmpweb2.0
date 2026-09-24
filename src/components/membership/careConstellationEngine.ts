// Imperative Three.js engine for the Care Constellation. Loaded only through a
// dynamic import from CareConstellation.tsx so three.js never ships in the
// initial bundle. Nothing here touches React state.
//
// One bounded particle pool per canvas. Every particle belongs to a calm
// free-flowing field; up to two attention "slots" can draw particles out of
// that field to the perimeter of a DOM card:
//   - slot A claims particles from the bottom of a per-particle random range,
//     slot B from the top, so the two never share (or trade) particles;
//   - which cards own the slots is decided with hysteresis, so small scroll
//     movements can't flip the active card;
//   - slot strengths ease in/out with delta-time damping, so a released card
//     loosens and its particles drift back into the field while the next
//     card's (different) particles gather.
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
import { buildParticles } from "./constellationFormations";
import type { DeviceTier } from "./motionCapability";

export type AnchorKind = "silver" | "gold" | "green";

export interface ConstellationAnchor {
  el: HTMLElement;
  kind: AnchorKind;
  // 0..1: share of the particle pool and brightness the card can attract.
  weight: number;
}

export interface ConstellationEngineOptions {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  host: HTMLElement;
  tier: DeviceTier;
  reducedMotion: boolean;
  anchors: ConstellationAnchor[];
  // Opacity of the free-flowing field (card perimeters are unaffected).
  intensity: number;
  onFailure: () => void;
}

export interface ConstellationController {
  setInView(inView: boolean): void;
  setReducedMotion(reduced: boolean): void;
  setIntensity(intensity: number): void;
  dispose(): void;
}

const TIER_SETTINGS: Record<DeviceTier, { count: number; minCount: number; maxDpr: number; size: number }> = {
  low: { count: 800, minCount: 350, maxDpr: 1.5, size: 2.6 },
  mid: { count: 1500, minCount: 600, maxDpr: 1.5, size: 2.4 },
  high: { count: 2600, minCount: 900, maxDpr: 1.75, size: 2.2 },
};

const CAMERA_Z = 7.5;
const FOV = 35;
const BASE_OPACITY = 0.9;

// Share of the pool one card may claim when it is the only active card, and
// when two cards (a desktop row) are active together.
const SINGLE_CAP = 0.9;
const PAIR_CAP = 0.48;

// Hysteresis bands as fractions of viewport height. A card must span ENTER to
// become active. Another card can take over only once the active one no longer
// spans HOLD; with no challenger it stays active until it leaves STAY. Moving
// between two stacked cards, the forward and backward switch points are far
// apart, so small scroll movements can't flip the active card.
const ENTER_BAND: [number, number] = [0.4, 0.6];
const HOLD_BAND: [number, number] = [0.3, 0.7];
const STAY_BAND: [number, number] = [0.15, 0.85];
const SAME_ROW = 0.15;

// Palette for light backgrounds. sRGB values go straight to the shader
// (Vector3, not Color) so three's colour management doesn't linearise them.
const COLORS = {
  green: new Vector3(0.0, 0.659, 0.588), // PMP accent-500 #00a896
  navy: new Vector3(0.32, 0.38, 0.48),
  silver: new Vector3(0.44, 0.53, 0.65),
  gold: new Vector3(0.7, 0.55, 0.26),
};

// Plan cards are mostly their tier colour with a clear PMP green minority;
// other cards are PMP green only.
const KIND_STYLE: Record<AnchorKind, { color: Vector3; tintShare: number; alpha: number; size: number }> = {
  silver: { color: COLORS.silver, tintShare: 0.64, alpha: 1, size: 1.2 },
  gold: { color: COLORS.gold, tintShare: 0.64, alpha: 1, size: 1.2 },
  green: { color: COLORS.green, tintShare: 0, alpha: 0.85, size: 1 },
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uMotion;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uPxWorld;
  uniform float uFreeOpacity;
  uniform vec2 uField;
  uniform vec3 uGreen;
  uniform vec3 uNavy;

  uniform vec4 uRectA;
  uniform vec4 uRectB;
  uniform vec4 uSlotA; // x claim, y strength, z corner radius, w size multiplier
  uniform vec4 uSlotB;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uLookA; // x tint share, y alpha
  uniform vec2 uLookB;

  attribute vec4 aPerim;
  attribute vec4 aSeed;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDepth;

  float gEdge;

  // Calm current: particles drift sideways at individual speeds (wrapping,
  // with a fade at the edges), ride a slow, low swell and breathe in depth.
  vec3 freeFlow() {
    float t = uTime;
    float x = fract(position.x * 0.5 + 0.5 + t * (0.006 + aSeed.z * 0.012)) * 2.0 - 1.0;
    float swell = 0.07 * sin(x * 2.1 + t * 0.21) + 0.035 * sin(x * 4.7 - t * 0.17 + 1.3);
    float y = position.y + swell + 0.03 * sin(t * 0.37 + aSeed.w * 6.2831853);
    float z = position.z + 0.3 * sin(t * 0.19 + aSeed.x * 6.2831853);
    gEdge = smoothstep(1.0, 0.82, abs(x));
    return vec3(x * uField.x, y * uField.y, z);
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

  // Around a card, loosening as the slot's strength falls.
  vec3 perimeter(vec4 rect, vec4 slot, float phase) {
    float u = aPerim.x + phase + uTime * aPerim.y;
    float stray = aPerim.w * (0.5 + 0.5 * sin(uTime * 0.21 + aSeed.w * 6.2831853)) * 30.0;
    float offset = (aPerim.z * mix(2.6, 1.0, slot.y) + stray) * uPxWorld;
    vec4 edge = roundedRect(rect.xy, rect.zw, slot.z, u);
    vec2 p = edge.xy + edge.zw * offset;
    p += vec2(sin(uTime * 0.7 + aSeed.w * 40.0), cos(uTime * 0.6 + aSeed.y * 40.0)) * uMotion * 1.5 * uPxWorld;
    return vec3(p, (aSeed.x - 0.5) * 0.2);
  }

  vec3 slotColor(vec3 tint, float share) {
    if (aSeed.y < share) return tint;
    return aSeed.y < 0.95 ? uGreen : uNavy;
  }

  void main() {
    // Slot A claims particles with r < claimA, slot B those with r > 1 - claimB.
    float r = fract(aPerim.x * 17.0 + aSeed.w * 7.13);
    float wA = smoothstep(0.0, 1.0, clamp((uSlotA.x - r) / 0.05, 0.0, 1.0));
    float wB = smoothstep(0.0, 1.0, clamp((r - (1.0 - uSlotB.x)) / 0.05, 0.0, 1.0));

    vec3 free = freeFlow();
    vec3 p = free;
    if (wA > 0.0) p += wA * (perimeter(uRectA, uSlotA, 0.0) - free);
    if (wB > 0.0) p += wB * (perimeter(uRectB, uSlotB, 0.37) - free);

    bool onA = wA >= wB;
    float w = max(wA, wB);
    vec3 freeColor = aSeed.y < 0.88 ? uGreen : uNavy;
    vec3 claimed = onA ? slotColor(uColorA, uLookA.x) : slotColor(uColorB, uLookB.x);
    vColor = mix(freeColor, claimed, w);

    // Particles in transit dip in opacity so releases read as a soft dispersal.
    float transit = 1.0 - 0.45 * sin(3.1415926 * w);
    vAlpha = mix(uFreeOpacity * gEdge, onA ? uLookA.y : uLookB.y, w) * transit;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float sizeMul = mix(1.0, onA ? uSlotA.w : uSlotB.w, w);
    gl_PointSize = uSize * sizeMul * (0.55 + aSeed.z * 0.9) * uPixelRatio * (${CAMERA_Z.toFixed(1)} / -mv.z);
    vDepth = smoothstep(${(CAMERA_Z + 3.5).toFixed(1)}, ${(CAMERA_Z - 3.5).toFixed(1)}, -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uOpacity;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDepth;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = 1.0 - smoothstep(0.16, 0.5, d);
    float alpha = a * vAlpha * uOpacity * (0.4 + 0.6 * vDepth);
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(vColor * alpha, alpha);
  }
`;

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

interface AnchorState {
  kind: AnchorKind;
  weight: number;
  x: number;
  y: number;
  w: number;
  h: number;
  radius: number;
}

interface Slot {
  anchor: number;
  strength: number;
  cap: number;
  claim: number;
}

export function createCareConstellation(options: ConstellationEngineOptions): ConstellationController | null {
  const { canvas, gl, host, tier, onFailure } = options;
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

  const particles = buildParticles(settings.count);
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(particles.field, 3));
  geometry.setAttribute("aPerim", new BufferAttribute(particles.perimeter, 4));
  geometry.setAttribute("aSeed", new BufferAttribute(particles.seeds, 4));

  const uniforms = {
    uTime: { value: 0 },
    uMotion: { value: options.reducedMotion ? 0 : 1 },
    uPixelRatio: { value: 1 },
    uSize: { value: settings.size },
    uPxWorld: { value: 0.01 },
    uFreeOpacity: { value: options.intensity },
    uOpacity: { value: BASE_OPACITY },
    uField: { value: new Vector2(3, 2) },
    uGreen: { value: COLORS.green },
    uNavy: { value: COLORS.navy },
    uRectA: { value: new Vector4(0, 0, 1, 1) },
    uRectB: { value: new Vector4(0, 0, 1, 1) },
    uSlotA: { value: new Vector4(0, 0, 0.1, 1) },
    uSlotB: { value: new Vector4(0, 0, 0.1, 1) },
    uColorA: { value: COLORS.green.clone() },
    uColorB: { value: COLORS.green.clone() },
    uLookA: { value: new Vector2(0, 1) },
    uLookB: { value: new Vector2(0, 1) },
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
  let intensity = options.intensity;

  let canvasW = 1;
  let canvasH = 1;
  let halfH = 1;

  let drawCount = settings.count;
  let sampleFrames = 0;
  let sampleTime = 0;

  // Cached page geometry, refreshed only when layout actually changes.
  let layerTop = 0;
  let layerLeft = 0;
  let layerHeight = 1;
  let holderHeight = 1;
  let viewportW = window.innerWidth;
  let viewportH = window.innerHeight;
  const anchors: AnchorState[] = options.anchors.map((a) => ({
    kind: a.kind,
    weight: a.weight,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    radius: 24,
  }));
  const anchorEls = options.anchors.map((a) => a.el);

  let primary = -1;
  const slots: [Slot, Slot] = [
    { anchor: -1, strength: 0, cap: 0, claim: 0 },
    { anchor: -1, strength: 0, cap: 0, claim: 0 },
  ];

  // iOS rubber-banding can report scroll positions outside the page.
  function scrollTop(): number {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(Math.max(window.scrollY, 0), Math.max(max, 0));
  }

  // Active cards: a primary chosen with hysteresis, plus at most one companion
  // on the same row (desktop plan pair, side-by-side panels).
  function activeAnchors(scrollY: number): number[] {
    const covers = (i: number, [lo, hi]: [number, number]) => {
      const a = anchors[i];
      if (a.w === 0 || a.h === 0) return false;
      const top = a.y - scrollY;
      return top < hi * viewportH && top + a.h > lo * viewportH;
    };
    const centre = (i: number) => anchors[i].y - scrollY + anchors[i].h / 2;

    if (primary >= 0 && !covers(primary, STAY_BAND)) primary = -1;
    if (primary < 0 || !covers(primary, HOLD_BAND)) {
      let best = Infinity;
      const current = primary;
      anchors.forEach((a, i) => {
        if (i === current || !covers(i, ENTER_BAND)) return;
        const score = Math.abs(centre(i) - viewportH / 2) - a.weight * 0.1 * viewportH;
        if (score < best) {
          best = score;
          primary = i;
        }
      });
    }
    if (primary < 0) return [];

    let companion = -1;
    let nearest = SAME_ROW * viewportH;
    anchors.forEach((_, i) => {
      if (i === primary || !covers(i, STAY_BAND)) return;
      const d = Math.abs(centre(i) - centre(primary));
      if (d < nearest) {
        nearest = d;
        companion = i;
      }
    });
    return companion >= 0 ? [primary, companion] : [primary];
  }

  // dt === null snaps (reduced motion, first frame).
  function updateSlots(dt: number | null) {
    const scrollY = scrollTop();
    const desired = activeAnchors(scrollY);

    for (const index of desired) {
      if (slots.some((s) => s.anchor === index)) continue;
      const free = slots.find((s) => s.anchor === -1);
      if (free) {
        free.anchor = index;
        free.strength = 0;
        free.cap = 0;
      }
    }

    for (const slot of slots) {
      const active = slot.anchor >= 0 && desired.includes(slot.anchor);
      const capTarget = active ? anchors[slot.anchor].weight * (desired.length === 1 ? SINGLE_CAP : PAIR_CAP) : slot.cap;
      const target = active ? 1 : 0;
      if (dt === null) {
        slot.strength = target;
        slot.cap = capTarget;
      } else {
        slot.strength = damp(slot.strength, target, target > slot.strength ? 1.8 : 2.6, dt);
        slot.cap = damp(slot.cap, capTarget, 2, dt);
      }
      slot.claim = slot.cap * slot.strength;
      if (!active && slot.strength < 0.01) {
        slot.anchor = -1;
        slot.strength = slot.cap = slot.claim = 0;
      }
    }

    // The two claims must never overlap: a releasing slot keeps its particles,
    // and the other only takes what is left.
    const [a, b] = slots;
    if (a.claim + b.claim > 0.98) {
      const aKeeps = !desired.includes(a.anchor) || (desired.includes(b.anchor) && a.strength >= b.strength);
      if (aKeeps) b.claim = Math.max(0, 0.98 - a.claim);
      else a.claim = Math.max(0, 0.98 - b.claim);
    }

    // Project cached rects into the sticky canvas (no layout reads).
    const holderTop = Math.min(Math.max(layerTop - scrollY, 0), layerTop + layerHeight - holderHeight - scrollY);
    const pxWorld = (2 * halfH) / canvasH;
    uniforms.uPxWorld.value = pxWorld;
    slots.forEach((slot, i) => {
      const slotU = i === 0 ? uniforms.uSlotA.value : uniforms.uSlotB.value;
      slotU.x = slot.claim;
      if (slot.anchor < 0) return;
      const a = anchors[slot.anchor];
      const style = KIND_STYLE[a.kind];
      const cx = a.x - layerLeft + a.w / 2;
      const cy = a.y - scrollY - holderTop + a.h / 2;
      (i === 0 ? uniforms.uRectA : uniforms.uRectB).value.set(
        (cx - canvasW / 2) * pxWorld,
        -(cy - canvasH / 2) * pxWorld,
        (a.w / 2) * pxWorld,
        (a.h / 2) * pxWorld,
      );
      slotU.set(slot.claim, slot.strength, a.radius * pxWorld, style.size);
      (i === 0 ? uniforms.uColorA : uniforms.uColorB).value.copy(style.color);
      (i === 0 ? uniforms.uLookA : uniforms.uLookB).value.set(style.tintShare, style.alpha * (0.55 + 0.45 * a.weight));
    });
  }

  function render() {
    renderer.render(scene, camera);
    if (!hasRendered) {
      hasRendered = true;
      canvas.style.opacity = "1";
    }
  }

  // Reduced motion: no loop. The field is still, cards snap to their state and
  // a frame is drawn whenever something could have moved them.
  function renderStatic() {
    if (disposed) return;
    uniforms.uMotion.value = 0;
    uniforms.uFreeOpacity.value = intensity;
    updateSlots(null);
    render();
  }

  function onScroll() {
    if (!reducedMotion || !inView || staticRafId || disposed) return;
    staticRafId = requestAnimationFrame(() => {
      staticRafId = 0;
      renderStatic();
    });
  }

  function measure() {
    const layerPos = pagePosition(layer);
    layerTop = layerPos.y;
    layerLeft = layerPos.x;
    layerHeight = layer.offsetHeight;
    holderHeight = holder.offsetHeight;

    anchorEls.forEach((el, i) => {
      const pos = pagePosition(el);
      const a = anchors[i];
      a.x = pos.x;
      a.y = pos.y;
      a.w = el.offsetWidth;
      a.h = el.offsetHeight;
      a.radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 24;
    });
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
    uniforms.uField.value.set(halfH * camera.aspect * 1.05, halfH * 1.05);
    measure();

    if (reducedMotion) renderStatic();
  }

  // Ignore height-only changes from Safari's collapsing address bar; they would
  // otherwise shift the attention bands mid-gesture.
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

    uniforms.uTime.value += dt;
    uniforms.uMotion.value = Math.min(1, uniforms.uMotion.value + dt);
    uniforms.uFreeOpacity.value = damp(uniforms.uFreeOpacity.value, intensity, 2, dt);
    updateSlots(dt);

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
  layoutObserver.observe(layer);
  layoutObserver.observe(document.body);
  anchorEls.forEach((el) => layoutObserver.observe(el));
  window.addEventListener("resize", onWindowResize, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);
  canvas.addEventListener("webglcontextlost", onContextLost);
  // Web fonts can shift card heights after first layout.
  document.fonts?.ready.then(() => !disposed && measure());

  resizeCanvas();
  updateSlots(null);
  // Start from the calm field and let the first active card gather gently.
  slots.forEach((slot) => {
    slot.strength = slot.claim = 0;
  });
  // Compile now rather than inside the first scroll-synced animation frame.
  renderer.compile(scene, camera);
  if (reducedMotion) renderStatic();

  // Development-only inspection hook for automated checks; compiled out of production builds.
  if (import.meta.env.DEV) {
    (window as Window & { __pmpConstellation?: unknown }).__pmpConstellation = {
      primary: () => primary,
      slots: () => slots.map((s) => ({ ...s })),
      drawCount: () => drawCount,
    };
  }

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
    setIntensity(value) {
      intensity = value;
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
