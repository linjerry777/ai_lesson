import { describe, expect, it, vi } from 'vitest'
import type Stripe from 'stripe'

vi.mock('@/lib/supabase/server', () => ({ createServiceClient: () => ({}) }))

import { checkSession, isSessionId, productSlugOf } from '@/lib/kit-orders'

function session(overrides: Partial<Stripe.Checkout.Session> = {}): Stripe.Checkout.Session {
  return {
    id: 'cs_live_a1B2c3D4e5F6g7H8',
    status: 'complete',
    payment_status: 'paid',
    amount_total: 39900,
    currency: 'twd',
    livemode: true,
    customer_details: { email: 'buyer@example.com' },
    payment_link: { id: 'plink_1', metadata: { product_slug: 'shorts-studio-kit' } },
    metadata: {},
    ...overrides,
  } as unknown as Stripe.Checkout.Session
}

describe('kit order verification', () => {
  it('accepts only real Checkout Session ids', () => {
    expect(isSessionId('cs_live_a1B2c3D4e5F6g7H8')).toBe(true)
    expect(isSessionId('cs_test_a1B2c3D4e5F6g7H8')).toBe(true)
    expect(isSessionId('../../etc/passwd')).toBe(false)
    expect(isSessionId('pi_123')).toBe(false)
    expect(isSessionId(undefined)).toBe(false)
  })

  it('reads the product from the Payment Link metadata', () => {
    expect(productSlugOf(session())).toBe('shorts-studio-kit')
    expect(productSlugOf(session({ payment_link: 'plink_1', metadata: { product_slug: 'auto-publish-course' } }))).toBe('auto-publish-course')
    expect(productSlugOf(session({ payment_link: 'plink_1USgc15t4WzXNwwbbZUSypV5', metadata: {} }))).toBe('shorts-studio-kit')
    expect(productSlugOf(session({ payment_link: 'plink_unknown', metadata: {} }))).toBeNull()
  })

  it('delivers a paid, complete session for a product with a file', () => {
    const result = checkSession(session())
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.order.product.slug).toBe('shorts-studio-kit')
      expect(result.order.email).toBe('buyer@example.com')
    }
  })

  it('delivers 100% promotion-code orders and bundles', () => {
    expect(checkSession(session({ payment_status: 'no_payment_required', amount_total: 0, total_details: { amount_discount: 39900, amount_shipping: 0, amount_tax: 0 } } as Partial<Stripe.Checkout.Session>)).ok).toBe(true)
    const bundle = checkSession(session({ amount_total: 79900, payment_link: 'plink_1USgfk5t4WzXNwwb4TEd29ND', metadata: {} }))
    expect(bundle.ok && bundle.order.product.slug).toBe('all-in-one')
    const course = checkSession(session({ amount_total: 49000, payment_link: 'plink_1USgdt5t4WzXNwwbmc8Rpd6G', metadata: {} }))
    expect(course.ok && course.order.product.slug).toBe('claude-code-course')
  })

  it('refuses unpaid or incomplete sessions', () => {
    expect(checkSession(session({ payment_status: 'unpaid' }))).toEqual({ ok: false, reason: 'unpaid' })
    expect(checkSession(session({ status: 'open' }))).toEqual({ ok: false, reason: 'unpaid' })
  })

  it('refuses unknown products, products without a file, and underpaid links', () => {
    expect(checkSession(session({ payment_link: { id: 'p', metadata: { product_slug: 'nope' } } as unknown as Stripe.PaymentLink })).ok).toBe(false)
    expect(checkSession(session({ amount_total: 100 })).ok).toBe(false)
  })
})
