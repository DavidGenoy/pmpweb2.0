// Per-particle data for the Care Constellation. There are no shape formations:
// particles live in a free-flowing field and some are drawn to card perimeters.
// Everything is sampled randomly (never by index order), so any prefix of the
// buffers is a uniform subset. The engine relies on that to lower particle
// density by shrinking the draw range.

export interface ParticleBuffers {
  // Free-flow home position: x/y in [-1, 1] (stretched to the canvas), z depth.
  field: Float32Array;
  // Start position along a perimeter (0..1), flow speed (perimeter lengths per
  // second), outward offset in CSS px, stray amount (0 = hugs the edge).
  perimeter: Float32Array;
  seeds: Float32Array;
}

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

function gaussian(rand: Rand): number {
  const u = Math.max(rand(), 1e-7);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
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

export function buildParticles(count: number, seed = 20260923): ParticleBuffers {
  const field = new Float32Array(count * 3);
  const perimeter = new Float32Array(count * 4);
  const seeds = new Float32Array(count * 4);

  const fieldRand = mulberry32(seed);
  for (let i = 0; i < count; i++) field.set([fieldRand() * 2 - 1, fieldRand() * 2 - 1, -1.6 + fieldRand() * 2.6], i * 3);

  const perimeterRand = mulberry32(seed ^ 0x5bd1e995);
  for (let i = 0; i < count; i++) perimeter.set(perimeterParticle(perimeterRand), i * 4);

  const rand = mulberry32(seed ^ 0x9e3779b9);
  for (let i = 0; i < seeds.length; i++) seeds[i] = rand();

  return { field, perimeter, seeds };
}
