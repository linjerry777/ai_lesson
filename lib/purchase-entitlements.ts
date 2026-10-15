import type Stripe from 'stripe'
import {
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
  stripe_payment_intent?: string | null
  amount: number | null
  currency: string | null
  status: 'completed'
  product_id: ProductSlug
  tier: Tier
  updated_at?: string
}

export function buildStripePurchaseRecord(
  session: Pick<Stripe.Checkout.Session, 'id' | 'amount_total' | 'currency' | 'metadata'> & Partial<Pick<Stripe.Checkout.Session, 'payment_intent'>>,
): PurchaseRecord {
  const userId = session.metadata?.user_id
  const productId = session.metadata?.product_id
  const tier = session.metadata?.tier

  if (!userId) throw new Error('Missing user_id')
  if (session.metadata?.app_id !== PLATFORM_APP_ID) throw new Error('Invalid app_id')
  if (!isValidProduct(productId) || getCourse(productId)?.isFree) {
    throw new Error('Invalid paid product_id')
  }
  if (!isValidTier(tier)) throw new Error('Invalid tier')

  return {
    app_id: PLATFORM_APP_ID,
    user_id: userId,
    stripe_session_id: session.id,
    stripe_payment_intent: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
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
    options: { onConflict: PURCHASE_UPSERT_CONFLICT, ignoreDuplicates: true },
  } as const
}
