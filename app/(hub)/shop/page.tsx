import type { Metadata } from 'next'
import ProductGrid from '@/components/site/ProductGrid'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `工作流與課程 | ${SITE.name}`,
  description: '複製貼上就能用的 AI 指令包，以及照著跑的短影音工作流套件。每一個上架前都實際跑過一次。',
  alternates: { canonical: '/shop' },
}

export default function ShopPage() {
  return (
    <main className="min-h-[70svh] bg-[#fafaf8] px-4 pb-28 pt-10 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[.16em] text-[var(--ink-2)]">SHOP · 工作流與課程</p>
            <h1 className="mt-3 text-[clamp(34px,4.6vw,68px)] font-black leading-[1.04] tracking-[-.04em]">照著貼，就能跑。</h1>
            <p className="mt-3 max-w-xl text-[16px] leading-8 text-[var(--ink-2)]">每個產品都是 Claude 隊每天實際在用的東西：複製貼上的指令，或下載就能跑的工作流。每一個上架前都實際跑過一次。</p>
          </div>
          <div className="flex items-end gap-3 lg:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stickers/xun-explain.webp" alt="小訊" className="sticker-img h-[120px] w-auto shrink-0 sm:h-[150px]" />
            <div className="relative mb-6 max-w-sm border-2 border-[var(--ink)] bg-white px-4 py-3 text-[14px] leading-6 shadow-[4px_4px_0_var(--ink)]">
              <span className="absolute -left-[9px] bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-[var(--ink)] bg-white" aria-hidden="true" />
              <b>小訊幫你挑：</b>沒寫過程式，先拿 <b>NT$199 指令包</b>，複製貼上就能用。想每天自動出片，選 <b>NT$399 工作流套件</b>，裝好說一句話就出一支。
            </div>
          </div>
        </div>
        <div className="mt-12"><ProductGrid /></div>
      </div>
    </main>
  )
}
