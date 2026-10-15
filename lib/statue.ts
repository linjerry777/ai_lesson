// Timing for the solid-statue shatter test (/lab2): one statue holds, shatters
// into its Blender fragments, and the next statue's fragments fly in and lock
// back together. `t` per fragment: 0 = in place, 1 = fully blown apart.

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smooth = (t: number) => t * t * (3 - 2 * t)

export const SHATTER = [0.26, 0.5] as const // first statue breaks apart
export const ASSEMBLE = [0.38, 0.72] as const // second statue comes together
const STAGGER = 0.45 // share of the window used to offset fragments from each other

/** Fragment progress inside a window; `order` 0..1 decides who moves first. */
function windowed(g: number, [a, b]: readonly [number, number], order: number) {
  const span = (b - a) * (1 - STAGGER)
  const start = a + (b - a - span) * clamp01(order)
  return smooth(clamp01((g - start) / span))
}

export function shatterAmount(g: number, order: number) {
  return windowed(g, SHATTER, order)
}

/** 1 while the fragment is still scattered, 0 once it has locked into place. */
export function assembleAmount(g: number, order: number) {
  return 1 - windowed(g, ASSEMBLE, 1 - order)
}

export function firstPanel(g: number) {
  return 1 - smooth(clamp01((g - 0.16) / 0.1))
}
export function secondPanel(g: number) {
  return smooth(clamp01((g - 0.74) / 0.08))
}
