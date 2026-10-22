import { describe, expect, it, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

// Two real-shaped Stripe sessions for the buyer (one prompt pack, one download kit),
// plus noise that must not show up: an abandoned checkout and someone else's link.
const sessions = [
  { id: 'cs_live_pack0000000000001', status: 'complete', payment_status: 'no_payment_required', amount_total: 0, currency: 'twd', livemode: true, created: 1792500000,
    customer_details: { email: 'buyer@example.com' }, total_details: { amount_discount: 19900 }, payment_link: { id: 'plink_1USx4T5t4WzXNwwby0UJsVd5', metadata: { product_slug: 'shorts-script-pack' } }, metadata: {} },
  { id: 'cs_live_kit00000000000002', status: 'complete', payment_status: 'paid', amount_total: 29900, currency: 'twd', livemode: true, created: 1792600000,
    customer_details: { email: 'buyer@example.com' }, total_details: { amount_discount: 0 }, payment_link: { id: 'plink_1UTKyL5t4WzXNwwbUAXcaC1C', metadata: { product_slug: 'carousel-studio-kit' } }, metadata: {} },
  { id: 'cs_live_open0000000000003', status: 'open', payment_status: 'unpaid', amount_total: 39900, currency: 'twd', livemode: true, created: 1792700000,
    customer_details: { email: 'buyer@example.com' }, total_details: { amount_discount: 0 }, payment_link: { id: 'plink_1USgc15t4WzXNwwbbZUSypV5', metadata: { product_slug: 'shorts-studio-kit' } }, metadata: {} },
]
const list = vi.fn(async ({ customer_details }: { customer_details: { email: string } }) =>
  ({ data: customer_details.email === 'buyer@example.com' ? sessions : [] }))

vi.mock('stripe', () => {
  class FakeStripe { checkout = { sessions: { list } }; static errors = { StripeInvalidRequestError: class extends Error {} } }
  return { default: FakeStripe }
})
vi.mock('@/lib/supabase/server', () => ({ createServiceClient: () => ({}), createClient: async () => ({ auth: { getUser: async () => ({ data: { user: null } }) } }) }))

process.env.STRIPE_KIT_KEY = 'rk_test_dummy'
const { ordersForEmail } = await import('@/lib/kit-orders')
const { OrderList } = await import('@/app/(hub)/orders/page')

describe('找回購買內容', () => {
  it('finds only paid orders for the signed-in email, newest first', async () => {
    const orders = await ordersForEmail('Buyer@Example.com')
    expect(orders?.map(order => order.product.slug)).toEqual(['carousel-studio-kit', 'shorts-script-pack'])
    // Stripe matches emails exactly, so the lower-cased spelling is tried as well.
    expect(list).toHaveBeenCalledWith(expect.objectContaining({ customer_details: { email: 'buyer@example.com' } }))
  })

  it('lists each order with a link back to its delivery page', async () => {
    const html = renderToStaticMarkup(await OrderList({ email: 'buyer@example.com' }))
    expect(html).toContain('IG 輪播圖產生器')
    expect(html).toContain('短影音爆款腳本指令包')
    expect(html).toContain('/thanks?session_id=cs_live_kit00000000000002')
    expect(html).not.toContain('cs_live_open0000000000003')
  })

  it('says so when the email has no orders', async () => {
    const html = renderToStaticMarkup(await OrderList({ email: 'nobody@example.com' }))
    expect(html).toContain('沒有找到付款紀錄')
  })
})
