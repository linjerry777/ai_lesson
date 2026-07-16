import { describe, expect, it } from 'vitest'
import {
  buildStripePurchaseRecord,
  purchaseUpsert,
  PURCHASE_UPSERT_CONFLICT,
} from '@/lib/purchase-entitlements'

const baseSession = {
  id: 'cs_test_example',
  amount_total: 990,
  currency: 'twd',
}

describe('Stripe purchase entitlement', () => {
  it('maps trusted checkout metadata into an app-scoped purchase', () => {
    const record = buildStripePurchaseRecord({
      ...baseSession,
      metadata: {
        user_id: 'user-1',
        product_id: 'claude-code',
        tier: 'self',
      },
    })

    expect(record).toMatchObject({
      app_id: 'ai-lesson',
      user_id: 'user-1',
      stripe_session_id: 'cs_test_example',
      product_id: 'claude-code',
      tier: 'self',
      status: 'completed',
    })
  })

  it('keeps legacy sessions compatible when product and tier metadata are absent', () => {
    const record = buildStripePurchaseRecord({
      ...baseSession,
      metadata: { user_id: 'user-1' },
    })

    expect(record.product_id).toBe('claude-code')
    expect(record.tier).toBe('self')
  })

  it.each<{ metadata: Record<string, string> | null; label: string }>([
    { metadata: null, label: 'missing user' },
    { metadata: { user_id: 'user-1', product_id: 'starter-free' }, label: 'free product' },
    { metadata: { user_id: 'user-1', product_id: 'unknown' }, label: 'unknown product' },
    { metadata: { user_id: 'user-1', tier: 'enterprise' }, label: 'unknown tier' },
  ])('rejects invalid entitlement metadata: $label', ({ metadata }) => {
    expect(() => buildStripePurchaseRecord({ ...baseSession, metadata })).toThrow()
  })

  it('upserts on the shared app/session uniqueness boundary', () => {
    const record = buildStripePurchaseRecord({
      ...baseSession,
      metadata: { user_id: 'user-1' },
    })

    expect(purchaseUpsert(record)).toEqual({
      values: record,
      options: { onConflict: PURCHASE_UPSERT_CONFLICT },
    })
    expect(PURCHASE_UPSERT_CONFLICT).toBe('app_id,stripe_session_id')
  })
})
