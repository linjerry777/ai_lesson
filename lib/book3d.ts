// Timeline for the WebGL pop-up book. One global scroll progress `g` (0..1)
// drives the camera path, the cover folding, the page flip and the next
// chapter popping up, so the whole thing reads as a single continuous shot.

import { easeOutBack } from './popup'

export type Vec3 = [number, number, number]

/** `focus` is where depth of field is sharp (defaults to `target`). */
export interface CameraKey { at: number; pos: Vec3; target: Vec3; focus?: Vec3 }

/** Book space: spread is 6.4 wide (x), 4.4 deep (z, far = negative), page top at y≈0.2. */
export const SPREAD = { width: 6.4, depth: 4.4, pageTop: 0.2 }

export const CAMERA_PATH: CameraKey[] = [
  { at: 0.0, pos: [0.4, 8.2, 10.8], target: [0.4, 0.6, -0.2] },   // whole book on the desk
  { at: 0.2, pos: [2.2, 3.6, 6.6], target: [1.0, 1.15, -0.5] },   // lean into the cover scene
  { at: 0.33, pos: [1.0, 5.0, 7.6], target: [0.4, 0.6, -0.2] },   // pull up as it folds
  { at: 0.5, pos: [0.2, 6.4, 7.9], target: [0.2, 0.4, -0.2] },    // watch the page turn
  { at: 0.72, pos: [-1.2, 3.8, 6.9], target: [-0.95, 1.0, -0.5], focus: [0.0, 1.1, 0.1] }, // lean into free lessons
  { at: 1.0, pos: [-0.9, 4.6, 7.7], target: [-0.8, 0.8, -0.3], focus: [0.0, 1.0, 0.1] },
]

export const TIMELINE = {
  coverFold: [0.27, 0.37] as const,
  flip: [0.37, 0.55] as const,
  freePop: [0.52, 0.68] as const,
  coverCopy: [0.17, 0.26] as const, // fade out
  freeCopy: [0.6, 0.7] as const, // fade in
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smooth = (t: number) => t * t * (3 - 2 * t)
const range = (g: number, [a, b]: readonly [number, number]) => clamp01((g - a) / (b - a))

export function cameraAt(g: number): { pos: Vec3; target: Vec3; focus: Vec3 } {
  const keys = CAMERA_PATH
  const resolve = (k: CameraKey) => ({ pos: k.pos, target: k.target, focus: k.focus ?? k.target })
  if (g <= keys[0].at) return resolve(keys[0])
  for (let i = 1; i < keys.length; i++) {
    if (g <= keys[i].at) {
      const a = resolve(keys[i - 1]), b = resolve(keys[i])
      const t = smooth((g - keys[i - 1].at) / (keys[i].at - keys[i - 1].at))
      const mix = (p: Vec3, q: Vec3): Vec3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]
      return { pos: mix(a.pos, b.pos), target: mix(a.target, b.target), focus: mix(a.focus, b.focus) }
    }
  }
  return resolve(keys[keys.length - 1])
}

/** Cover layers: opened by the intro (0..1 over time), folded by scroll. */
export function coverLift(g: number, intro: number, order: number) {
  const start = clamp01(order) * 0.45
  const up = easeOutBack(clamp01((intro - start) / 0.55))
  const [a, b] = TIMELINE.coverFold
  const stagger = (1 - clamp01(order)) * 0.03 // front layers fold first
  const down = clamp01((g - a - stagger) / (b - a - 0.03))
  return Math.max(0, intro <= 0 ? 0 : up - down)
}

/** Page turn angle in radians, 0 (flat right) → π (flat left). */
export function flipAngle(g: number) {
  return Math.PI * smooth(range(g, TIMELINE.flip))
}

export function freeLift(g: number, order: number) {
  const [a, b] = TIMELINE.freePop
  const span = (b - a) * 0.5
  const start = a + (b - a - span) * clamp01(order)
  return easeOutBack(clamp01((g - start) / span))
}

export function coverCopyOpacity(g: number) {
  return 1 - range(g, TIMELINE.coverCopy)
}
export function freeCopyOpacity(g: number) {
  return range(g, TIMELINE.freeCopy)
}

/** Where a layer stands, in book space, from the same 0..1 layout used by the CSS book. */
export function layerPlacement(x: number, depth: number) {
  return {
    x: (x - 0.5) * SPREAD.width,
    z: (0.5 - depth) * SPREAD.depth * 0.86,
  }
}
