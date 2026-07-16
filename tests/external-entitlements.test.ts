import { describe, expect, it } from 'vitest'
import {
  claimExternalEntitlementsWithStore,
  type ExternalEntitlement,
  type ExternalEntitlementStore,
} from '@/lib/external-entitlements'
import type { PurchaseRecord } from '@/lib/purchase-entitlements'

class MemoryStore implements ExternalEntitlementStore {
  purchases = new Map<string, PurchaseRecord>()
  queries: string[] = []

  constructor(private entitlements: ExternalEntitlement[]) {}

  async findPendingByEmail(email: string) {
    this.queries.push(email)
    return this.entitlements
  }

  async upsertPurchase(record: PurchaseRecord) {
    this.purchases.set(`${record.app_id}:${record.stripe_session_id}`, record)
  }

  async claimPending(id: string) {
    const index = this.entitlements.findIndex((item) => item.id === id)
    if (index === -1) return false
    this.entitlements.splice(index, 1)
    return true
  }
}

const entitlement: ExternalEntitlement = {
  id: 'ent-1',
  provider: 'shopify',
  provider_order_id: 'order-1',
  product_id: 'claude-code',
  tier: 'self',
  amount: 990,
  currency: 'twd',
}

describe('external entitlement claim', () => {
  it('normalizes email and creates an app-scoped synthetic purchase', async () => {
    const store = new MemoryStore([{ ...entitlement }])
    const claimed = await claimExternalEntitlementsWithStore(
      store,
      'user-1',
      '  Jerry@Example.COM ',
      '2026-07-16T00:00:00.000Z',
    )

    expect(claimed).toBe(1)
    expect(store.queries).toEqual(['jerry@example.com'])
    expect(Array.from(store.purchases.values())[0]).toMatchObject({
      app_id: 'ai-lesson',
      user_id: 'user-1',
      stripe_session_id: 'external:shopify:order-1:claude-code',
      product_id: 'claude-code',
      tier: 'self',
    })
  })

  it('is idempotent when the same claim runs again', async () => {
    const store = new MemoryStore([{ ...entitlement }])

    expect(await claimExternalEntitlementsWithStore(store, 'user-1', 'jerry@example.com')).toBe(1)
    expect(await claimExternalEntitlementsWithStore(store, 'user-1', 'jerry@example.com')).toBe(0)
    expect(store.purchases.size).toBe(1)
  })

  it('leaves malformed or free entitlements pending and does not grant access', async () => {
    const store = new MemoryStore([
      { ...entitlement, id: 'bad-provider', provider: 'other' },
      { ...entitlement, id: 'free', product_id: 'starter-free' },
      { ...entitlement, id: 'bad-tier', tier: 'enterprise' },
    ])

    expect(await claimExternalEntitlementsWithStore(store, 'user-1', 'jerry@example.com')).toBe(0)
    expect(store.purchases.size).toBe(0)
  })
})
