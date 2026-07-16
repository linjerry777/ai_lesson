import { createServiceClient } from '@/lib/supabase/server'
import { getCourse, isValidProduct, isValidTier } from '@/lib/courses'
import { PLATFORM_APP_ID } from '@/lib/platform'
import {
  purchaseUpsert,
  type PurchaseRecord,
} from '@/lib/purchase-entitlements'

export interface ExternalEntitlement {
  id: string
  provider: string
  provider_order_id: string
  product_id: string
  tier: string
  amount: number | null
  currency: string | null
}

export interface ExternalEntitlementStore {
  findPendingByEmail(email: string): Promise<ExternalEntitlement[]>
  upsertPurchase(record: PurchaseRecord): Promise<void>
  claimPending(id: string, userId: string, claimedAt: string): Promise<boolean>
}

const PROVIDERS = new Set(['shopify', 'woocommerce', 'shopline'])

export function buildExternalPurchaseRecord(
  entitlement: ExternalEntitlement,
  userId: string,
  now: string,
): PurchaseRecord | null {
  if (!PROVIDERS.has(entitlement.provider)) return null
  if (!isValidProduct(entitlement.product_id) || getCourse(entitlement.product_id)?.isFree) {
    return null
  }
  if (!isValidTier(entitlement.tier)) return null

  return {
    app_id: PLATFORM_APP_ID,
    user_id: userId,
    stripe_session_id: `external:${entitlement.provider}:${entitlement.provider_order_id}:${entitlement.product_id}`,
    amount: entitlement.amount,
    currency: entitlement.currency,
    status: 'completed',
    product_id: entitlement.product_id,
    tier: entitlement.tier,
    updated_at: now,
  }
}

export async function claimExternalEntitlementsWithStore(
  store: ExternalEntitlementStore,
  userId: string,
  email: string,
  now = new Date().toISOString(),
) {
  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) return 0

  const entitlements = await store.findPendingByEmail(normalizedEmail)
  let claimed = 0

  for (const entitlement of entitlements) {
    const purchase = buildExternalPurchaseRecord(entitlement, userId, now)
    if (!purchase) continue

    // Persist first so a transient claim update failure is recoverable on retry.
    // The app/session unique key makes repeated upserts idempotent.
    await store.upsertPurchase(purchase)
    if (await store.claimPending(entitlement.id, userId, now)) claimed += 1
  }

  return claimed
}

function createSupabaseEntitlementStore(): ExternalEntitlementStore {
  const supabase = createServiceClient()

  return {
    async findPendingByEmail(email) {
      const { data, error } = await supabase
        .from('ai_lesson_external_entitlements')
        .select('id,provider,provider_order_id,product_id,tier,amount,currency')
        .eq('app_id', PLATFORM_APP_ID)
        .eq('purchaser_email', email)
        .eq('status', 'pending')
      if (error) throw error
      return (data ?? []) as ExternalEntitlement[]
    },
    async upsertPurchase(record) {
      const upsert = purchaseUpsert(record)
      const { error } = await supabase.from('purchases').upsert(upsert.values, upsert.options)
      if (error) throw error
    },
    async claimPending(id, userId, claimedAt) {
      const { data, error } = await supabase
        .from('ai_lesson_external_entitlements')
        .update({
          status: 'claimed',
          user_id: userId,
          claimed_at: claimedAt,
          updated_at: claimedAt,
        })
        .eq('id', id)
        .eq('status', 'pending')
        .select('id')
        .maybeSingle()
      if (error) throw error
      return !!data
    },
  }
}

export function claimExternalEntitlements(userId: string, email: string) {
  return claimExternalEntitlementsWithStore(createSupabaseEntitlementStore(), userId, email)
}
