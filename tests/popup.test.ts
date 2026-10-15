import { describe, expect, it } from 'vitest'
import { copyVisibility, layerLift, sectionProgress } from '@/lib/popup'

describe('pop-up book timing', () => {
  it('keeps layers flat before the chapter and fully folded after it', () => {
    expect(layerLift(0, 0)).toBe(0)
    expect(layerLift(1, 0)).toBe(0)
    expect(layerLift(1, 1)).toBe(0)
  })

  it('stands every layer up during the hold, back layers first', () => {
    expect(layerLift(0.6, 0)).toBeCloseTo(1)
    expect(layerLift(0.6, 1)).toBeCloseTo(1)
    expect(layerLift(0.12, 0)).toBeGreaterThan(layerLift(0.12, 1))
  })

  it('overshoots slightly as paper snaps upright', () => {
    const peak = Math.max(...Array.from({ length: 50 }, (_, i) => layerLift(0.04 + i * 0.008, 0)))
    expect(peak).toBeGreaterThan(1)
    expect(peak).toBeLessThan(1.2)
  })

  it('shows everything immediately for reduced motion', () => {
    expect(layerLift(0, 0.5, true)).toBe(1)
    expect(copyVisibility(0.99, true)).toBe(1)
  })

  it('fades copy in and out with the chapter', () => {
    expect(copyVisibility(0)).toBe(0)
    expect(copyVisibility(0.5)).toBe(1)
    expect(copyVisibility(0.95)).toBe(0)
  })

  it('maps section position to 0..1 progress', () => {
    expect(sectionProgress(100, 2700, 900)).toBe(0)
    expect(sectionProgress(-900, 2700, 900)).toBe(0.5)
    expect(sectionProgress(-5000, 2700, 900)).toBe(1)
  })
})
