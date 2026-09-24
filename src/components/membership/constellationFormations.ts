// Pure position generators for the Care Constellation formations.
// Every formation samples randomly (never by index order), so any prefix of the
// buffers is a uniform subset of the whole shape. The engine relies on that to
// lower particle density by shrinking the draw range.

export const FORMATION_ORDER = ["dispersed", "silver", "flow", "gold", "unified", "dual", "family"] as const;
export type ConstellationFormation = (typeof FORMATION_ORDER)[number];

// Largest radius any formation reaches; the engine scales the group so this
// always fits inside the canvas, including narrow portrait phones.
export const FORMATION_EXTENT = 2.05;

// Formations that scroll-progress mode steps through, in order.
export const PROGRESS_SEQUENCE: readonly ConstellationFormation[] = ["dispersed", "silver", "flow", "gold", "unified"];

export type FormationBuffers = Record<ConstellationFormation, Float32Array> & { seeds: Float32Array };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;
type Vec3 = [number, number, number];

function gaussian(rand: Rand): number {
  const u = Math.max(rand(), 1e-7);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

function randomDirection(rand: Rand): Vec3 {
  const z = rand() * 2 - 1;
  const t = rand() * Math.PI * 2;
  const r = Math.sqrt(1 - z * z);
  return [r * Math.cos(t), r * Math.sin(t), z];
}

function rotateX([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [x, y * c - z * s, y * s + z * c];
}

function rotateZ([x, y, z]: Vec3, a: number): Vec3 {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c, z];
}

function ringPoint(rand: Rand, radius: number, spread: number, tiltX: number, tiltZ: number): Vec3 {
  const theta = rand() * Math.PI * 2;
  const r = radius + gaussian(rand) * spread;
  const p: Vec3 = [Math.cos(theta) * r, gaussian(rand) * spread * 0.6, Math.sin(theta) * r];
  return rotateZ(rotateX(p, tiltX), tiltZ);
}

function corePoint(rand: Rand, radius: number): Vec3 {
  const [x, y, z] = randomDirection(rand);
  const r = radius * Math.pow(rand(), 0.7);
  return [x * r, y * r, z * r];
}

const DEG = Math.PI / 180;

// x/y in [-1, 1] are stretched to the canvas edges in the vertex shader.
function dispersed(rand: Rand): Vec3 {
  return [rand() * 2 - 1, rand() * 2 - 1, -1.8 + rand() * 3];
}

// A single, restrained orbital ring around a soft core.
function silver(rand: Rand): Vec3 {
  if (rand() < 0.8) return ringPoint(rand, 1.55, 0.075, 68 * DEG, -12 * DEG);
  return corePoint(rand, 0.45);
}

// Three braided strands flowing across the frame; x is stretched to the canvas
// width in the vertex shader, amplitude tapers toward the edges.
function flow(rand: Rand): Vec3 {
  const t = rand() * 2 - 1;
  const strand = Math.floor(rand() * 3);
  const phase = t * Math.PI * 1.2 + strand * ((2 * Math.PI) / 3);
  const taper = 1 - 0.45 * t * t;
  return [
    t,
    0.5 * taper * Math.sin(phase) + gaussian(rand) * 0.055,
    0.5 * taper * Math.cos(phase) + gaussian(rand) * 0.055,
  ];
}

// Two interlocking orbits, a denser core and faint outer dust: visibly richer
// than Silver without becoming busy.
function gold(rand: Rand): Vec3 {
  const pick = rand();
  if (pick < 0.4) return ringPoint(rand, 1.5, 0.06, 52 * DEG, 30 * DEG);
  if (pick < 0.76) return ringPoint(rand, 1.7, 0.065, 58 * DEG, -32 * DEG);
  if (pick < 0.92) return corePoint(rand, 0.5);
  const [x, y, z] = randomDirection(rand);
  const r = 1.95 + rand() * 0.25;
  return [x * r * 0.9, y * r * 0.9, z * r * 0.9];
}

// A calm, unified sphere: the organised end state.
function unified(rand: Rand): Vec3 {
  const [x, y, z] = randomDirection(rand);
  const r = rand() < 0.85 ? 1.15 + gaussian(rand) * 0.045 : 1.15 * Math.pow(rand(), 0.5);
  return [x * r, y * r, z * r];
}

// Silver (x < 0) and Gold (x > 0) side by side: a single orbit beside a pair of
// interlocking orbits. The shader tints each side by the sign of x.
function dual(rand: Rand): Vec3 {
  if (rand() < 0.44) {
    const [x, y, z] = rand() < 0.8 ? ringPoint(rand, 0.72, 0.05, 66 * DEG, -10 * DEG) : corePoint(rand, 0.22);
    return [x - 1.08, y, z];
  }
  const pick = rand();
  const [x, y, z] =
    pick < 0.42
      ? ringPoint(rand, 0.76, 0.045, 52 * DEG, 30 * DEG)
      : pick < 0.82
        ? ringPoint(rand, 0.88, 0.05, 58 * DEG, -32 * DEG)
        : corePoint(rand, 0.26);
  return [x + 1.08, y, z];
}

// A member core with up to three linked family satellites.
const SATELLITES = [90, 210, 330].map((deg) => [Math.cos(deg * DEG) * 1.45, Math.sin(deg * DEG) * 1.45]);

function family(rand: Rand): Vec3 {
  const pick = rand();
  if (pick < 0.38) return corePoint(rand, 0.55);
  const [sx, sy] = SATELLITES[Math.floor(rand() * 3)];
  if (pick < 0.76) {
    const [x, y, z] = corePoint(rand, 0.27);
    return [sx + x, sy + y, z];
  }
  // Soft filaments from the core to each satellite.
  const t = 0.3 + rand() * 0.5;
  return [sx * t + gaussian(rand) * 0.035, sy * t + gaussian(rand) * 0.035, gaussian(rand) * 0.05];
}

export function buildFormations(count: number, seed = 20260923): FormationBuffers {
  const generators: Record<ConstellationFormation, (rand: Rand) => Vec3> = {
    dispersed,
    silver,
    flow,
    gold,
    unified,
    dual,
    family,
  };
  const buffers = {
    ...(Object.fromEntries(FORMATION_ORDER.map((name) => [name, new Float32Array(count * 3)])) as Record<
      ConstellationFormation,
      Float32Array
    >),
    seeds: new Float32Array(count * 4),
  };

  for (const name of FORMATION_ORDER) {
    const rand = mulberry32(seed + name.length * 7919 + name.charCodeAt(0) * 31 + name.charCodeAt(1));
    const target = buffers[name];
    for (let i = 0; i < count; i++) target.set(generators[name](rand), i * 3);
  }

  const rand = mulberry32(seed ^ 0x9e3779b9);
  for (let i = 0; i < buffers.seeds.length; i++) buffers.seeds[i] = rand();

  return buffers;
}

export function formationIndex(formation: ConstellationFormation): number {
  return FORMATION_ORDER.indexOf(formation);
}
