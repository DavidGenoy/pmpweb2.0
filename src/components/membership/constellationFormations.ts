// Pure position generators for the Care Constellation formations.
// Every formation samples randomly (never by index order), so any prefix of the
// buffers is a uniform subset of the whole shape. The engine relies on that to
// lower particle density by shrinking the draw range.

// "cards" is not a fixed shape: the shader places those particles around the
// perimeters of real DOM plan cards, using the per-particle `perimeter` data.
export const FORMATION_ORDER = ["dispersed", "flow", "unified", "family", "cards"] as const;
export type ConstellationFormation = (typeof FORMATION_ORDER)[number];

type ShapeFormation = Exclude<ConstellationFormation, "cards">;
const SHAPE_FORMATIONS: readonly ShapeFormation[] = ["dispersed", "flow", "unified", "family"];

// Largest radius any shape formation reaches; the engine scales the group so
// this always fits inside the canvas, including narrow portrait phones.
export const FORMATION_EXTENT = 1.9;

// Formations that scroll-progress mode steps through, in order.
export const PROGRESS_SEQUENCE: readonly ConstellationFormation[] = ["dispersed", "flow", "unified"];

export type FormationBuffers = Record<ShapeFormation, Float32Array> & {
  // Per particle: start position along the perimeter (0..1), flow speed
  // (perimeter lengths per second), outward offset in CSS px, stray amount.
  perimeter: Float32Array;
  seeds: Float32Array;
};

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

// A calm, unified sphere: the organised end state.
function unified(rand: Rand): Vec3 {
  const [x, y, z] = randomDirection(rand);
  const r = rand() < 0.85 ? 1.15 + gaussian(rand) * 0.045 : 1.15 * Math.pow(rand(), 0.5);
  return [x * r, y * r, z * r];
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

// Most particles hug the card edge, some sit several pixels out, and a few
// strays drift farther away and back (the shader animates the stray amount).
function perimeterParticle(rand: Rand): [number, number, number, number] {
  const u = rand();
  const speed = 0.0035 + rand() * 0.0065;
  const pick = rand();
  if (pick < 0.68) return [u, speed, 2 + Math.abs(gaussian(rand)) * 3, 0];
  if (pick < 0.9) return [u, speed, 7 + rand() * 14, 0];
  return [u, speed * 0.6, 14 + rand() * 18, 0.6 + rand() * 0.4];
}

export function buildFormations(count: number, seed = 20260923): FormationBuffers {
  const generators: Record<ShapeFormation, (rand: Rand) => Vec3> = { dispersed, flow, unified, family };
  const buffers = {
    ...(Object.fromEntries(SHAPE_FORMATIONS.map((name) => [name, new Float32Array(count * 3)])) as Record<
      ShapeFormation,
      Float32Array
    >),
    perimeter: new Float32Array(count * 4),
    seeds: new Float32Array(count * 4),
  };

  for (const name of SHAPE_FORMATIONS) {
    const rand = mulberry32(seed + name.length * 7919 + name.charCodeAt(0) * 31 + name.charCodeAt(1));
    const target = buffers[name];
    for (let i = 0; i < count; i++) target.set(generators[name](rand), i * 3);
  }

  const perimeterRand = mulberry32(seed ^ 0x5bd1e995);
  for (let i = 0; i < count; i++) buffers.perimeter.set(perimeterParticle(perimeterRand), i * 4);

  const rand = mulberry32(seed ^ 0x9e3779b9);
  for (let i = 0; i < buffers.seeds.length; i++) buffers.seeds[i] = rand();

  return buffers;
}

export function formationIndex(formation: ConstellationFormation): number {
  return FORMATION_ORDER.indexOf(formation);
}
