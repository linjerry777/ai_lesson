import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SITE } from '@/lib/site'

/** Client work lives on Jerry AI Studio; this is only the hand-off line. */
export default function Studio() {
  return (
    <section id="studio" className="relative scroll-mt-16 overflow-hidden border-t-2 border-[var(--ink)] bg-[#fafaf8] px-4 py-20 sm:px-8" aria-labelledby="studio-title">
      <div className="mx-auto grid max-w-[1440px] items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="flex items-center gap-4 font-mono text-[11px] tracking-[.2em]">05 <span className="h-px w-10 bg-[var(--ink)]" /> STUDIO / 接案</p>
          <h2 id="studio-title" className="font-serif-tc mt-8 text-[clamp(36px,4.6vw,72px)] font-light leading-[1.15]">你的 AI 自動化，也可以交給我。</h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[var(--ink-2)]">AI 短影音流水線、網站與金流、LINE 與內部自動化工具。做過的案子和合作方式，都整理在 Jerry AI Studio。</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={SITE.studioUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-14 items-center gap-3 bg-[var(--ink)] px-8 text-[15px] tracking-[.08em] text-[#fafaf8] transition hover:bg-[#333]">
              看作品與合作方式 <ArrowUpRight size={17} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <a href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent('合作洽詢｜JERRY.AI')}`} className="inline-flex min-h-14 items-center gap-2 border border-[var(--ink)] px-8 text-[15px] tracking-[.08em] transition hover:bg-[var(--ink)] hover:text-[#fafaf8]">
              直接寄信 <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/stickers/xun-thumbsup.webp" alt="" loading="lazy" className="sticker-img hidden w-[200px] rotate-3 lg:block" />
      </div>
    </section>
  )
}
