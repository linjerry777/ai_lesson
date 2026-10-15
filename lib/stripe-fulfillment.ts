import type Stripe from 'stripe'
import { getSaleOffer, isValidProduct, isValidTier } from './courses'
import { PLATFORM_APP_ID } from './platform'
import { buildStripePurchaseRecord, type PurchaseRecord } from './purchase-entitlements'

export class InvalidCheckoutError extends Error {}
export class RevokedCheckoutError extends Error {
  constructor(public readonly purchase: PurchaseRecord, public readonly status: 'refunded' | 'disputed') {
    super('Checkout payment revoked')
  }
}

/** Call only after signature verification AND server-side Stripe session retrieval. */
export function validatePaidCheckout(session: Stripe.Checkout.Session, priceId: string, live: boolean) {
  const metadata = session.metadata
  if (metadata?.app_id !== PLATFORM_APP_ID || !metadata.user_id ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(metadata.user_id) ||
    session.client_reference_id !== metadata.user_id || !isValidProduct(metadata.product_id) || !isValidTier(metadata.tier)) {
    throw new InvalidCheckoutError('Invalid checkout identity')
  }
  const offer = getSaleOffer(metadata.product_id, metadata.tier)
  const line = session.line_items?.data[0]
  const price = line?.price
  const intent = typeof session.payment_intent === 'object' ? session.payment_intent : null
  const charge = typeof intent?.latest_charge === 'object' ? intent.latest_charge : null
  if (!offer || session.mode !== 'payment' || session.status !== 'complete' ||
    session.payment_status !== 'paid' || session.livemode !== live ||
    session.currency !== offer.currency || session.amount_total !== offer.amountMinor ||
    session.line_items?.has_more || session.line_items?.data.length !== 1 ||
    line?.quantity !== 1 || line.amount_total !== offer.amountMinor || !price ||
    price.id !== priceId || price.currency !== offer.currency || price.unit_amount !== offer.amountMinor || price.type !== 'one_time' ||
    intent?.metadata?.app_id !== metadata.app_id || intent.metadata.user_id !== metadata.user_id ||
    intent.metadata.product_id !== metadata.product_id || intent.metadata.tier !== metadata.tier ||
    !intent || intent.status !== 'succeeded' || !charge) {
    throw new InvalidCheckoutError('Checkout does not match the course offer')
  }
  if (charge.refunded || charge.disputed || charge.amount_refunded > 0) throw new RevokedCheckoutError(buildStripePurchaseRecord(session), charge.disputed ? 'disputed' : 'refunded')
  return buildStripePurchaseRecord(session)
}

export function validateCheckoutPrice(price: Stripe.Price, amountMinor: number, live: boolean) {
  if (!price.active || price.livemode !== live || price.currency !== 'twd' ||
    price.unit_amount !== amountMinor || price.type !== 'one_time') {
    throw new InvalidCheckoutError('Configured Price does not match the course offer')
  }
}
