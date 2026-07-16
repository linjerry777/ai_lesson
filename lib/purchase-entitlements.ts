import type Stripe from 'stripe'
import {
  DEFAULT_PRODUCT,
  DEFAULT_TIER,
  getCourse,
  isValidProduct,
  isValidTier,
  type ProductSlug,
  type Tier,
} from '@/lib/courses'
import { PLATFORM_APP_ID } from '@/lib/platform'

export const PURCHASE_UPSERT_CONFLICT = 'app_id,stripe_session_id'

export interface PurchaseRecord {
  app_id: typeof PLATFORM_APP_ID
  user_id: string
  stripe_session_id: string
  amount: number | null
  currency: string | null
  status: 'completed'
  product_id: ProductSlug
  tier: Tier
  updated_at?: string
}

export function buildStripePurchaseRecord(
  session: Pick<Stripe.Checkout.Session, 'id' | 'amount_total' | 'currency' | 'metadata'>,
): PurchaseRecord {
  const userId = session.metadata?.user_id
  const productId = session.metadata?.product_id ?? DEFAULT_PRODUCT
  const tier = session.metadata?.tier ?? DEFAULT_TIER

  if (!userId) throw new Error('Missing user_id')
  if (!isValidProduct(productId) || getCourse(productId)?.isFree) {
    throw new Error('Invalid paid product_id')
  }
  if (!isValidTier(tier)) throw new Error('Invalid tier')

  return {
    app_id: PLATFORM_APP_ID,
    user_id: userId,
    stripe_session_id: session.id,
    amount: session.amount_total,
    currency: session.currency,
    status: 'completed',
    product_id: productId,
    tier,
  }
}

export function purchaseUpsert(record: PurchaseRecord) {
  return {
    values: record,
    options: { onConflict: PURCHASE_UPSERT_CONFLICT },
  } as const
}
