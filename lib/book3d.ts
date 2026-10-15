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
  { at: 0.12, pos: [2.2, 3.6, 6.6], target: [1.0, 1.15, -0.5] },  // lean into the cover scene
  { at: 0.2, pos: [1.0, 5.0, 7.6], target: [0.4, 0.6, -0.2] },    // pull up as it folds
  { at: 0.3, pos: [0.2, 6.4, 7.9], target: [0.2, 0.4, -0.2] },    // watch the page turn
  { at: 0.45, pos: [-1.2, 3.8, 6.9], target: [-0.95, 1.0, -0.5], focus: [0.0, 1.1, 0.1] }, // lean into free lessons
  { at: 0.55, pos: [-0.9, 4.2, 7.3], target: [-0.8, 0.9, -0.4], focus: [0.0, 1.0, 0.1] },
  { at: 0.68, pos: [0.0, 6.6, 8.2], target: [0.1, 0.4, -0.2] },   // pull up for the second turn
  { at: 0.88, pos: [0.1, 4.2, 9.9], target: [-0.45, 1.05, -0.4], focus: [0.0, 1.2, 0.0] }, // the channel wall
  { at: 1.0, pos: [0.0, 4.5, 10.4], target: [-0.45, 1.0, -0.4], focus: [0.0, 1.2, 0.0] },
]

export const TIMELINE = {
  coverFold: [0.17, 0.23] as const,
  flip: [0.23, 0.34] as const,
  freePop: [0.32, 0.42] as const,
  freeFold: [0.56, 0.62] as const,
  flip2: [0.62, 0.74] as const,
  channelsPop: [0.72, 0.84] as const,
  coverCopy: [0.1, 0.16] as const, // fade out
  freeCopy: [0.37, 0.43] as const, // fade in
  freeCopyOut: [0.53, 0.58] as const,
  channelsCopy: [0.8, 0.87] as const, // fade in
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

/** Page turn angle in radians, 0 (flat right) → π (flat left). `turn` 1 or 2. */
export function flipAngle(g: number, turn: 1 | 2 = 1) {
  return Math.PI * smooth(range(g, turn === 1 ? TIMELINE.flip : TIMELINE.flip2))
}

/** Back-to-front pop-up inside `pop`, optional fold-down inside `fold`. */
function chapterLift(g: number, order: number, pop: readonly [number, number], fold?: readonly [number, number]) {
  const [a, b] = pop
  const span = (b - a) * 0.5
  const start = a + (b - a - span) * clamp01(order)
  const up = easeOutBack(clamp01((g - start) / span))
  if (!fold) return up
  const stagger = (1 - clamp01(order)) * 0.02 // front layers fold first
  const down = clamp01((g - fold[0] - stagger) / (fold[1] - fold[0] - 0.02))
  return Math.max(0, up - down)
}

export function freeLift(g: number, order: number) {
  return chapterLift(g, order, TIMELINE.freePop, TIMELINE.freeFold)
}
export function channelsLift(g: number, order: number) {
  return chapterLift(g, order, TIMELINE.channelsPop)
}

export function coverCopyOpacity(g: number) {
  return 1 - range(g, TIMELINE.coverCopy)
}
export function freeCopyOpacity(g: number) {
  return range(g, TIMELINE.freeCopy) - range(g, TIMELINE.freeCopyOut)
}
export function channelsCopyOpacity(g: number) {
  return range(g, TIMELINE.channelsCopy)
}

/** Where a layer stands, in book space, from the same 0..1 layout used by the CSS book. */
export function layerPlacement(x: number, depth: number) {
  return {
    x: (x - 0.5) * SPREAD.width,
    z: (0.5 - depth) * SPREAD.depth * 0.86,
  }
}
