// Pop-up book timing. Each chapter is a tall section with a sticky stage;
// `progress` (0..1) is how far the reader has scrolled through that section.
// Layers stand up one after another, hold, then fold flat before the page turns.

export const POP_IN = [0.04, 0.42] as const
export const FOLD_OUT = [0.86, 1] as const
export const STAND_ANGLE = 72 // degrees a fully popped layer is lifted off the page

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/** Spring-ish ease that slightly overshoots, like paper snapping upright. */
export function easeOutBack(t: number, overshoot = 1.4) {
  const c = overshoot + 1
  return 1 + c * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2)
}

/**
 * How upright a layer is (0 = flat on the page, ~1 = standing).
 * `order` 0..1 staggers layers back-to-front; `reduced` skips the motion.
 */
export function layerLift(progress: number, order: number, reduced = false) {
  if (reduced) return 1
  const [inStart, inEnd] = POP_IN
  const span = (inEnd - inStart) * 0.55
  const start = inStart + (inEnd - inStart - span) * clamp01(order)
  const up = clamp01((progress - start) / span)
  const down = clamp01((progress - FOLD_OUT[0]) / (FOLD_OUT[1] - FOLD_OUT[0]))
  return Math.max(0, easeOutBack(up) - down)
}

/** Copy fades in with the first layers and out with the fold. */
export function copyVisibility(progress: number, reduced = false) {
  if (reduced) return 1
  const fadeIn = clamp01((progress - 0.08) / 0.18)
  const fadeOut = clamp01((progress - 0.8) / 0.12)
  return Math.max(0, fadeIn - fadeOut)
}

/** 0..1 progress of a section whose top is `top` px from the viewport top. */
export function sectionProgress(top: number, height: number, viewport: number) {
  const scrollable = height - viewport
  if (scrollable <= 0) return top <= 0 ? 1 : 0
  return clamp01(-top / scrollable)
}
