import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductGrid from '@/components/site/ProductGrid'
import { Kicker } from '@/components/site/ui'

/** The store, introduced by 小訊 so first-time visitors know where to start. */
export default function Shop() {
  return (
    <section id="shop" className="relative scroll-mt-16 border-t-2 border-[var(--ink)] bg-[#fafaf8] px-4 py-16 sm:px-8 lg:py-20" aria-labelledby="shop-title">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <Kicker color="#2747ff">03 — SHOP / 工作流與課程</Kicker>
            <h2 id="shop-title" className="mt-3 text-[clamp(30px,4.2vw,64px)] font-black leading-[1.04] tracking-[-.04em]">把贏的那套，<span className="bg-[#2747ff] px-2 text-white [box-decoration-break:clone]">帶回家</span>。</h2>
            <p className="mt-3 max-w-xl text-[15px] leading-7 text-[var(--ink-2)]">Claude 隊每天在用的指令、工作流和課程。買一次，之後的更新都免費。</p>
          </div>
          <div className="flex items-end gap-3 lg:justify-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stickers/xun-explain.webp" alt="小訊" loading="lazy" className="sticker-img h-[120px] w-auto shrink-0 sm:h-[150px]" />
            <div className="relative mb-6 max-w-sm border-2 border-[var(--ink)] bg-white px-4 py-3 text-[14px] leading-6 shadow-[4px_4px_0_var(--ink)]">
              <span className="absolute -left-[9px] bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-[var(--ink)] bg-white" aria-hidden="true" />
              <b>小訊幫你挑：</b>沒寫過程式，先拿 <b>NT$199 指令包</b>，複製貼上就能用。想自己架網站收錢，選 <b>Claude Code 課</b>；全都要，<b>全套最划算</b>。
            </div>
          </div>
        </div>
        <div className="mt-10"><ProductGrid /></div>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-1.5 font-mono text-[12px] font-bold tracking-[.1em] hover:underline">全部工作流與課程 <ArrowRight size={14} aria-hidden="true" /></Link>
      </div>
    </section>
  )
}
