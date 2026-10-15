import { describe, expect, it } from 'vitest'
import { ASSEMBLE, assembleAmount, firstPanel, secondPanel, SHATTER, shatterAmount } from '@/lib/statue'

describe('statue shatter timing', () => {
  it('keeps the first statue whole until the shatter window, then blows it apart', () => {
    expect(shatterAmount(0, 0)).toBe(0)
    expect(shatterAmount(SHATTER[0], 1)).toBe(0)
    expect(shatterAmount(SHATTER[1], 0)).toBe(1)
    expect(shatterAmount(SHATTER[1], 1)).toBe(1)
  })

  it('cracks spread from the crack point: near fragments move first', () => {
    const mid = (SHATTER[0] + SHATTER[1]) / 2
    expect(shatterAmount(mid, 0)).toBeGreaterThan(shatterAmount(mid, 1))
  })

  it('brings the second statue in from scattered to locked', () => {
    expect(assembleAmount(ASSEMBLE[0], 0.5)).toBe(1)
    expect(assembleAmount(ASSEMBLE[1], 0)).toBe(0)
    expect(assembleAmount(1, 1)).toBe(0)
  })

  it('overlaps the two so fragments share the air mid-transition', () => {
    expect(ASSEMBLE[0]).toBeLessThan(SHATTER[1])
  })

  it('shows each panel only while its statue is whole', () => {
    expect(firstPanel(0)).toBe(1)
    expect(firstPanel(0.4)).toBe(0)
    expect(secondPanel(0.5)).toBe(0)
    expect(secondPanel(0.95)).toBe(1)
  })
})
