import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import LoginForm from '@/app/login/LoginForm'
import { ordersForEmail } from '@/lib/kit-orders'
import { SITE } from '@/lib/site'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `找回購買內容 | ${SITE.name}`,
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

const date = (seconds?: number) => (seconds ? new Date(seconds * 1000).toLocaleDateString('zh-TW', { timeZone: 'Asia/Taipei' }) : '')

/**
 * Lost the payment-complete page? Sign in with the email used at checkout (Google or an
 * email link) and every paid order for that email is listed, read straight from Stripe.
 */
export default async function OrdersPage() {
  const { data: { user } } = await (await createClient()).auth.getUser()
  const email = user?.email_confirmed_at ? user.email : null

  return (
    <main className="px-4 pb-28 pt-12 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] font-bold tracking-[.16em] text-[var(--ink-2)]">MY ORDERS</p>
        <h1 className="mt-3 text-[clamp(30px,5vw,44px)] font-black leading-tight">找回購買內容</h1>

        {!email ? (
          <>
            <p className="mt-4 text-[16px] leading-8 text-[var(--ink-2)]">
              付款完成頁關掉了沒關係。用<b className="text-[var(--ink)]">付款時填的同一個 Email</b> 登入（Google 或寄登入連結到信箱），就會列出你買過的所有東西。
            </p>
            <div className="mt-6"><LoginForm nextPath="/orders" /></div>
            <p className="mt-4 text-sm leading-7 text-[var(--ink-2)]">收不到登入信、或付款時用的 Email 已經不能用：把 Stripe 寄給你的收據轉寄到 <a href={`mailto:${SITE.contactEmail}`} className="underline">{SITE.contactEmail}</a>，我手動幫你處理。</p>
          </>
        ) : (
          <OrderList email={email} />
        )}
      </div>
    </main>
  )
}

export async function OrderList({ email }: { email: string }) {
  const orders = await ordersForEmail(email)
  if (orders === null) {
    return <p className="mt-6 text-[16px] leading-8 text-[var(--ink-2)]">暫時查不到訂單，請過一分鐘重新整理；一直不行請來信 {SITE.contactEmail}。</p>
  }
  return (
    <>
      <p className="mt-4 text-[16px] leading-8 text-[var(--ink-2)]">用 <b className="text-[var(--ink)]">{email}</b> 付款的訂單：</p>
      {orders.length ? (
        <ul className="mt-6 space-y-3">
          {orders.map(order => (
            <li key={order.sessionId}>
              <Link href={`/thanks?session_id=${encodeURIComponent(order.sessionId)}`} className="group flex items-center justify-between gap-4 border-2 border-[var(--ink)] bg-white p-4 shadow-[4px_4px_0_var(--ink)] transition hover:-translate-y-0.5">
                <span>
                  <span className="block text-lg font-black">{order.product.name}</span>
                  <span className="text-sm text-[var(--ink-2)]">{date(order.createdAt)} 購買</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-black">打開 <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 border-2 border-dashed border-[var(--ink)] p-4 text-[15px] leading-7">
          這個 Email 沒有找到付款紀錄。付款時用的可能是另一個 Email：登出後換那個 Email 再登入，或來信 {SITE.contactEmail} 附上收據。
        </p>
      )}
      <form action="/api/auth/signout" method="post" className="mt-8">
        <button className="text-sm underline">換一個 Email（登出）</button>
      </form>
    </>
  )
}
