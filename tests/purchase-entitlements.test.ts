import { describe, expect, it } from 'vitest'
import {
  buildStripePurchaseRecord,
  purchaseUpsert,
  PURCHASE_UPSERT_CONFLICT,
} from '@/lib/purchase-entitlements'

const baseSession = {
  id: 'cs_test_example',
  amount_total: 99000,
  currency: 'twd',
}

describe('Stripe purchase entitlement', () => {
  it('maps trusted checkout metadata into an app-scoped purchase', () => {
    const record = buildStripePurchaseRecord({
      ...baseSession,
      metadata: {
        app_id: 'ai-lesson',
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

  it('rejects sessions without explicit app/product/tier identity', () => {
    expect(() => buildStripePurchaseRecord({
      ...baseSession,
      metadata: { user_id: 'user-1' },
    })).toThrow()
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
      metadata: { app_id: 'ai-lesson', user_id: 'user-1', product_id: 'claude-code', tier: 'self' },
    })

    expect(purchaseUpsert(record)).toEqual({
      values: record,
      options: { onConflict: PURCHASE_UPSERT_CONFLICT, ignoreDuplicates: true },
    })
    expect(PURCHASE_UPSERT_CONFLICT).toBe('app_id,stripe_session_id')
  })
})
