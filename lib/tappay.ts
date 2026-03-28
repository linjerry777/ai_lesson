// TapPay server-side helper
export const TAPPAY_API_URL =
  process.env.NEXT_PUBLIC_TAPPAY_ENV === 'production'
    ? 'https://prod.tappaysdk.com/tpc/payment/pay-by-prime'
    : 'https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime'

export interface TapPayResult {
  status: number
  msg: string
  rec_trade_id?: string
  bank_transaction_id?: string
  amount?: number
  currency?: string
}

export async function payByPrime(payload: {
  prime: string
  amount: number
  currency: string
  details: string
  cardholder: { phone_number: string; name: string; email: string }
  backend_notify_url: string
}): Promise<TapPayResult> {
  const res = await fetch(TAPPAY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.TAPPAY_PARTNER_KEY!,
    },
    body: JSON.stringify({
      prime: payload.prime,
      partner_key: process.env.TAPPAY_PARTNER_KEY,
      merchant_id: process.env.TAPPAY_MERCHANT_ID,
      amount: payload.amount,
      currency: payload.currency,
      details: payload.details,
      cardholder: payload.cardholder,
      remember: false,
      backend_notify_url: payload.backend_notify_url,
    }),
  })
  return res.json()
}
