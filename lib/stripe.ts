import Stripe from 'stripe'

export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  const key = process.env.STRIPE_SECRET_KEY.trim()
  if (!(stripeIsLive() ? key.startsWith('sk_live_') : key.startsWith('sk_test_'))) {
    throw new Error('Stripe key does not match configured payment mode')
  }
  return new Stripe(key, {
    typescript: true,
  })
}

export function stripeIsLive() {
  const mode = process.env.AI_LESSON_STRIPE_MODE ?? 'sandbox'
  if (mode !== 'sandbox' && mode !== 'live') throw new Error('Invalid Stripe mode')
  return mode === 'live'
}
