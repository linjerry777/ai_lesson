import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { SITE } from '@/lib/site'

const SERVICES = [
  { title: 'AI 短影音流水線', text: '選題 → 腳本 → 配音 → 剪輯 → 發布，替你的品牌搭一條會自己跑的產線。' },
  { title: '網站、金流與會員', text: 'Next.js · Supabase · Stripe，從 Landing Page 到付款解鎖一次做好。' },
  { title: '內部自動化工具', text: 'LINE Bot、報表、資料整理，把每天重複的事交給程式。' },
]

export default function Studio() {
  return (
    <section id="studio" className="relative scroll-mt-16 overflow-hidden border-t-2 border-[var(--ink)] bg-[#fafaf8] px-4 pt-24 sm:px-8" aria-labelledby="studio-title">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)]">
        <div className="pb-24">
          <p className="flex items-center gap-4 font-mono text-[11px] tracking-[.2em]">05 <span className="h-px w-10 bg-[var(--ink)]" /> STUDIO / 接案</p>
          <h2 id="studio-title" className="font-serif-tc mt-8 text-[clamp(40px,5.6vw,88px)] font-light leading-[1.12]">你的 AI 自動化，<br />也可以交給我。</h2>
          <ul className="mt-12 max-w-2xl border-t border-[#121212]/25">
            {SERVICES.map((s, i) => (
              <li key={s.title} className="grid gap-2 border-b border-[#121212]/25 py-6 sm:grid-cols-[3rem_1fr]">
                <span className="font-mono text-[11px] text-[var(--ink-2)]">0{i + 1}</span>
                <span>
                  <span className="font-serif-tc block text-2xl">{s.title}</span>
                  <span className="mt-1 block text-[15px] leading-7 text-[var(--ink-2)]">{s.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={`mailto:${SITE.contactEmail}?subject=${encodeURIComponent('合作洽詢｜JERRY.AI')}`} className="group inline-flex min-h-14 items-center gap-3 bg-[var(--ink)] px-8 text-[15px] tracking-[.08em] text-[#fafaf8] transition hover:bg-[#333]">
              寄信聊聊 <ArrowRight size={17} className="transition group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a href={SITE.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center gap-2 border border-[var(--ink)] px-8 text-[15px] tracking-[.08em] transition hover:bg-[var(--ink)] hover:text-[#fafaf8]">
              作品集 <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <p className="mt-4 font-mono text-[11px] tracking-[.1em] text-[var(--ink-2)]">{SITE.contactEmail}</p>
        </div>
        <div className="relative min-h-[420px] lg:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stickers/xun-thumbsup.webp" alt="小訊" loading="lazy" className="absolute -bottom-6 left-1/2 w-[min(70%,420px)] -translate-x-1/2" />
        </div>
      </div>
    </section>
  )
}
