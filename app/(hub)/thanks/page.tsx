import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Download, LogIn } from 'lucide-react'
import { recordOrder, verifySession } from '@/lib/kit-orders'
import { deliverables } from '@/lib/products'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `付款完成 | ${SITE.name}`,
  robots: { index: false, follow: false },
}
export const dynamic = 'force-dynamic'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-[70svh] bg-[#fafaf8] px-4 pb-28 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-2xl">{children}</div>
    </main>
  )
}

export default async function ThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const sessionId = (await searchParams).session_id ?? ''
  const result = await verifySession(sessionId)
  const contact = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent('下載問題｜JERRY.AI')}`

  if (!result.ok) {
    return (
      <Shell>
        <p className="font-mono text-[11px] tracking-[.2em]">ORDER</p>
        <h1 className="font-serif-tc mt-6 text-4xl font-light leading-tight">找不到這筆已付款的訂單</h1>
        <p className="mt-5 text-[16px] leading-8 text-[var(--ink-2)]">
          {result.reason === 'unpaid' ? '付款還在處理中，過一兩分鐘重新整理這一頁。' : result.reason === 'unavailable' ? '系統暫時無法確認訂單，請稍後重新整理。' : '網址可能不完整。'}
          如果你已經付款，請把 Stripe 寄給你的收據轉寄到 <a href={contact} className="underline">{SITE.contactEmail}</a>，我會手動把檔案寄給你。
        </p>
      </Shell>
    )
  }

  const { order } = result
  await recordOrder(order, 'success_page')
  return (
    <Shell>
      <p className="flex items-center gap-4 font-mono text-[11px] tracking-[.2em]">THANK YOU <span className="h-px w-10 bg-[var(--ink)]" /> 付款完成</p>
      <h1 className="font-serif-tc mt-8 text-[clamp(36px,5vw,64px)] font-light leading-[1.12]">{order.product.name}</h1>
      <p className="mt-5 text-[16px] leading-8 text-[var(--ink-2)]">謝謝你的購買{order.email ? `（${order.email}）` : ''}。下面是這筆訂單的內容：</p>
      <ul className="mt-8 space-y-4">
        {deliverables(order.product).map(item => (
          <li key={item.slug} className="border border-[var(--ink)] bg-white p-5">
            <p className="font-serif-tc text-xl">{item.name}</p>
            {item.file && (
              <>
                <p className="mt-1 text-sm leading-7 text-[var(--ink-2)]">解壓縮後先打開 <code className="font-mono">README.md</code>，照裡面的設定 prompt 貼給 Claude Code 就能開始。</p>
                <a href={`/api/kit-download?session_id=${encodeURIComponent(order.sessionId)}&item=${item.slug}`} className="mt-4 inline-flex min-h-12 items-center gap-3 bg-[var(--ink)] px-6 text-[14px] tracking-[.06em] text-[#fafaf8] transition hover:bg-[#333]">
                  <Download size={17} aria-hidden="true" /> 下載 {item.file.downloadName}
                </a>
              </>
            )}
            {item.pack && (
              <>
                <p className="mt-1 text-sm leading-7 text-[var(--ink-2)]">網頁版，手機電腦都能開。打開後記得<strong className="text-[var(--ink)]">加入書籤</strong>，之後隨時回來複製。</p>
                <Link href={`/pack/${item.slug}?session_id=${encodeURIComponent(order.sessionId)}`} className="mt-4 inline-flex min-h-12 items-center gap-3 bg-[var(--ink)] px-6 text-[14px] tracking-[.06em] text-[#fafaf8] transition hover:bg-[#333]">
                  <ArrowUpRight size={17} aria-hidden="true" /> 打開指令包
                </Link>
              </>
            )}
            {item.grantsCourse && (
              <>
                <p className="mt-1 text-sm leading-7 text-[var(--ink-2)]">
                  用 <strong className="text-[var(--ink)]">{order.email ?? '付款時的 Email'}</strong> 這個 Google 帳號登入，課程會自動開通。用別的 Email 登入的話，來信告訴我，我幫你轉。
                </p>
                <Link href="/login?next=/dashboard" className="mt-4 inline-flex min-h-12 items-center gap-3 bg-[var(--ink)] px-6 text-[14px] tracking-[.06em] text-[#fafaf8] transition hover:bg-[#333]">
                  <LogIn size={17} aria-hidden="true" /> 登入並開始上課
                </Link>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-12 border-t border-[#121212]/25 pt-8 text-[15px] leading-8 text-[var(--ink-2)]">
        <p><strong className="text-[var(--ink)]">請把這一頁加入書籤。</strong>之後有新版（或全套加入新工作流），回到這一頁就能下載。</p>
        <p className="mt-3">卡住了或下載有問題，來信 <a href={contact} className="underline">{SITE.contactEmail}</a>，附上你的付款 Email。</p>
        <p className="mt-3"><Link href="/free" className="underline">順便拿免費的 AI 短影音 Prompt 包 →</Link></p>
      </div>
    </Shell>
  )
}
