import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PRODUCTS, canBuy, compareLabel, priceLabel } from '@/lib/products'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `工作流與課程 | ${SITE.name}`,
  description: '照著貼就能跑的 AI 工作流套件與實作課：Claude Code plugin、可直接渲染的模板、設定 prompt 與逐步檢查點。',
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  return (
    <main className="min-h-[70svh] bg-[#fafaf8] px-4 pb-28 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[1200px]">
        <p className="flex items-center gap-4 font-mono text-[11px] tracking-[.2em]">SHOP <span className="h-px w-10 bg-[var(--ink)]" /> 工作流與課程</p>
        <h1 className="font-serif-tc mt-8 text-[clamp(44px,6.4vw,96px)] font-light leading-[1.08]">照著貼，就能跑。</h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-8 text-[var(--ink-2)]">
          每個產品都附三樣東西：一個下載就能跑的 starter、一段貼給 Claude Code 的設定 prompt、每一步都寫好「成功長這樣」的檢查點。
        </p>

        <ul className="mt-16 border-t border-[var(--ink)]">
          {PRODUCTS.map((product, index) => {
            const soon = product.status === 'soon'
            return (
              <li key={product.slug} className="border-b border-[#121212]/25">
                <Link
                  href={`/shop/${product.slug}`}
                  className={`group grid gap-4 py-10 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:items-end ${soon ? 'opacity-55' : ''}`}
                >
                  <span className="font-mono text-[11px] text-[var(--ink-2)]">0{index + 1}</span>
                  <span>
                    <span className="font-mono text-[10px] tracking-[.2em] text-[var(--ink-2)]">{product.pack ? 'PROMPT PACK' : product.kind === 'kit' ? 'WORKFLOW KIT' : 'COURSE'} · {product.latin}</span>
                    <span className="font-serif-tc mt-2 block text-[clamp(28px,3.4vw,44px)] leading-tight group-hover:underline">{product.name}</span>
                    <span className="mt-2 block text-[15px] leading-7 text-[var(--ink-2)]">{product.tagline}</span>
                  </span>
                  <span className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <span className="font-serif text-4xl">{compareLabel(product) && <s className="mr-2 text-lg text-[var(--ink-2)]">{compareLabel(product)}</s>}{priceLabel(product)}</span>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] tracking-[.14em]">
                      {soon ? 'IN PRODUCTION' : canBuy(product) ? '現在可買' : '預購・開賣通知'} <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
        <p className="mt-8 font-mono text-[11px] leading-6 tracking-[.06em] text-[var(--ink-2)]">付款走 Stripe，完成後立刻下載。每個產品都附買家專屬 LINE 社群答疑。</p>
      </div>
    </main>
  )
}
