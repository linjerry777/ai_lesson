import type { Metadata } from 'next'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { recordOrder, verifySession } from '@/lib/kit-orders'
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
      <p className="mt-5 text-[16px] leading-8 text-[var(--ink-2)]">
        謝謝你的購買{order.email ? `（${order.email}）` : ''}。按下面的按鈕下載，解壓縮後先打開 <code className="font-mono text-sm">README.md</code>，照裡面的設定 prompt 貼給 Claude Code 就能開始。
      </p>
      <a href={`/api/kit-download?session_id=${encodeURIComponent(order.sessionId)}`} className="mt-10 inline-flex min-h-14 items-center gap-3 bg-[var(--ink)] px-8 text-[15px] tracking-[.08em] text-[#fafaf8] transition hover:bg-[#333]">
        <Download size={18} aria-hidden="true" /> 下載 {order.product.file?.downloadName}
      </a>
      <div className="mt-12 border-t border-[#121212]/25 pt-8 text-[15px] leading-8 text-[var(--ink-2)]">
        <p><strong className="text-[var(--ink)]">請把這一頁加入書籤。</strong>之後有新版，回到這一頁就能重新下載。</p>
        <p className="mt-3">卡住了或下載有問題，來信 <a href={contact} className="underline">{SITE.contactEmail}</a>，附上你的付款 Email。</p>
        <p className="mt-3"><Link href="/free" className="underline">順便拿免費的 AI 短影音 Prompt 包 →</Link></p>
      </div>
    </Shell>
  )
}
