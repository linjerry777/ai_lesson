import { describe, expect, it } from 'vitest'
import { panelOpacity, sectionAnchor, sectionState } from '@/lib/lab'

const N = 8

describe('particle page timing', () => {
  it('holds the first figure at the top and the last one at the bottom', () => {
    expect(sectionState(0, N)).toEqual({ index: 0, morph: 0 })
    expect(sectionState(1, N)).toEqual({ index: N - 1, morph: 0 })
  })

  it('morphs only in the second half of a section', () => {
    const at = (x: number) => x / (N - 1 + 0.35)
    expect(sectionState(at(2.3), N)).toEqual({ index: 2, morph: 0 })
    const mid = sectionState(at(2.8), N)
    expect(mid.index).toBe(2)
    expect(mid.morph).toBeGreaterThan(0)
    expect(mid.morph).toBeLessThan(1)
  })

  it('shows each panel while its figure holds and hides it during the morph', () => {
    const at = (x: number) => x / (N - 1 + 0.35)
    expect(panelOpacity(0, N, 0)).toBe(1)
    expect(panelOpacity(at(3.25), N, 3)).toBe(1)
    expect(panelOpacity(at(3.8), N, 3)).toBe(0)
    expect(panelOpacity(at(3.25), N, 4)).toBe(0)
    expect(panelOpacity(1, N, N - 1)).toBe(1)
  })

  it('jumps to a point where the section is readable', () => {
    for (let i = 0; i < N; i++) expect(panelOpacity(sectionAnchor(i, N), N, i)).toBeGreaterThan(0.9)
  })
})
