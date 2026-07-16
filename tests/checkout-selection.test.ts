import { describe, expect, it } from 'vitest'
import { resolveCheckoutSelection } from '@/lib/checkout-selection'

describe('resolveCheckoutSelection', () => {
  it('keeps an explicitly selected product and tier', () => {
    const selection = resolveCheckoutSelection('codex-remotion', 'cohort')

    expect(selection.productId).toBe('codex-remotion')
    expect(selection.tier).toBe('cohort')
    expect(selection.course.slug).toBe('codex-remotion')
  })

  it('falls back to the default paid course for unknown input', () => {
    const selection = resolveCheckoutSelection('not-a-course', 'not-a-tier')

    expect(selection.productId).toBe('claude-code')
    expect(selection.tier).toBe('self')
  })

  it('preserves the free primer selection for dashboard routing', () => {
    const selection = resolveCheckoutSelection('starter-free', 'self')

    expect(selection.course.isFree).toBe(true)
  })
})
