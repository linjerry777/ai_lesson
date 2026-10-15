// Scroll timing for the particle "deconstruct → reassemble" page (/lab).
// The page is a row of sections; each one holds a particle figure, then the
// figure scatters and re-forms into the next section's figure.

export const HOLD_END = 0.5 // fraction of a section spent holding the figure
export const TAIL = 0.35 // extra hold after the last section so it can be read

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

export interface SectionState {
  /** Figure being shown / morphed from. */
  index: number
  /** 0 = holding `index`, 1 = fully re-formed as `index + 1`. */
  morph: number
}

/** Position along the sections for overall progress g (0..1). */
export function sectionPosition(g: number, count: number) {
  return clamp01(g) * (count - 1 + TAIL)
}

export function sectionState(g: number, count: number): SectionState {
  const x = Math.min(sectionPosition(g, count), count - 1)
  const index = Math.min(Math.floor(x), count - 1)
  const f = x - index
  return { index, morph: index >= count - 1 ? 0 : smoothstep(HOLD_END + 0.05, 1, f) }
}

/** Side panel for section i is readable while its figure holds. */
export function panelOpacity(g: number, count: number, i: number) {
  const x = sectionPosition(g, count)
  const fadeIn = i === 0 ? 1 : smoothstep(i - 0.04, i + 0.1, x)
  const fadeOut = i >= count - 1 ? 0 : smoothstep(i + HOLD_END - 0.08, i + HOLD_END + 0.04, x)
  return fadeIn * (1 - fadeOut)
}

/** Scroll progress at which section i is fully readable (for nav jumps). */
export function sectionAnchor(i: number, count: number) {
  return Math.min(1, (i + 0.2) / (count - 1 + TAIL))
}
