import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { CHANNELS, pad2, slotLabel } from '@/lib/site'
import Ruler from '@/components/site/Ruler'
import StickerPile from '@/components/site/StickerPile'

export default function Hero() {
  return (
    <section className="relative mx-auto max-w-[1440px] px-4 pb-6 pt-6 sm:px-8 lg:pt-8" aria-labelledby="hero-title">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--rule)] pb-3 font-mono text-[10px] font-bold tracking-[.16em] text-[var(--ink-2)]">
        <span className="border border-[var(--ink)] px-2 py-1 text-[var(--ink)]">JERRY.AI — 24H ON AIR</span>
        <span className="hidden sm:inline">ONE PERSON · FIVE CHANNELS · ZERO DAYS OFF</span>
        <span className="flex gap-1" aria-hidden="true">
          {CHANNELS.map(c => <span key={c.key} className="h-3 w-4" style={{ background: c.color }} />)}
        </span>
      </div>

      <div className="grid items-center gap-6 pt-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-4 lg:pt-4">
        <div className="relative z-10">
          <p className="font-serif -rotate-6 text-[clamp(30px,3.6vw,54px)] italic leading-none text-[#2747ff]">24h on air</p>
          <h1 id="hero-title" className="mt-3 text-[clamp(40px,12vw,76px)] lg:text-[clamp(60px,6.3vw,116px)] font-black leading-[.98] tracking-[-.045em]">
            一個人，<br />
            <span className="text-[#ff5d8f]">五個</span>頻道，<br />
            每天<span className="text-[#ff4a1c]">自動</span>開播。
          </h1>
          <p className="mt-7 max-w-[34rem] text-[16px] leading-8 text-[var(--ink-2)] sm:text-[17px]">
            AI 新聞、Doro 日更、麻糬短劇、貓咪口播——全部由一條 AI 工作流每天自動產出。這裡是幕後：看節目、拿免費教學，也能把整套流程帶回家。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#channels" className="inline-flex min-h-12 items-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] px-6 text-sm font-bold text-[var(--paper)] shadow-[4px_4px_0_var(--red)] transition hover:-translate-y-0.5">
              看今天的節目 <ArrowDown size={16} aria-hidden="true" />
            </Link>
            <Link href="/free" className="inline-flex min-h-12 items-center gap-2 border-2 border-[var(--ink)] bg-[var(--white)] px-6 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ink)]">
              免費教學 <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="relative -mx-2 lg:mx-0">
          <StickerPile />
        </div>
      </div>

      {/* Phone: swipeable channel strip (desktop has the ruler below). */}
      <div className="-mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:hidden" aria-label="頻道列表">
        {CHANNELS.map((c, i) => (
          <Link key={c.key} href={`#ch-${c.key}`} className="flex w-[44vw] max-w-[220px] shrink-0 snap-start flex-col justify-between border-2 border-[var(--ink)] p-3" style={{ background: c.color, color: c.ink }}>
            <span className="font-mono text-[10px] font-bold tracking-[.14em] opacity-80">CH.{pad2(i + 1)} · {slotLabel(c)}</span>
            <span className="mt-6 text-2xl font-black leading-none">{c.name}</span>
            <ArrowRight size={16} className="mt-3" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="mt-6 hidden items-end gap-6 lg:flex">
        <p className="shrink-0 pb-6 font-display text-xl tracking-[.04em]">TODAY: {CHANNELS.length} CHANNELS</p>
        <div className="min-w-0 flex-1"><Ruler /></div>
      </div>
    </section>
  )
}
