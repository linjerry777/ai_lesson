import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { CHANNELS, RIVALRY } from '@/lib/site'

/** Claude's cast stands on the left (heights are % of the arena). */
const CLAUDE_CAST = [
  { src: 'xun', alt: '小訊（訊號滿格）', h: 88, r: -3, tag: '訊號滿格', color: '#2747ff' },
  { src: 'mochi', alt: '麻糬（麻糬QQ）', h: 90, r: 3, tag: '麻糬QQ', color: '#ff5d8f' },
  { src: 'nailao', alt: '奶烙（橘白貓）', h: 58, r: -2, tag: '奶烙', color: '#f5a524' },
]

export interface HeroStats {
  /** Uploads by Claude's channels in the last 24 hours. */
  claudeToday: number
  /** Days since Codex's newest upload; null when the feed could not be read. */
  codexIdleDays: number | null
}

export default function Hero({ stats }: { stats: HeroStats }) {
  return (
    <section className="relative border-b-2 border-[var(--ink)]" aria-labelledby="hero-title">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 pb-5 pt-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:pt-6">
        <div>
          <p className="font-mono text-[10px] font-bold tracking-[.16em] text-[var(--ink-2)]">JERRY.AI — ONE PERSON · TWO AIs · ONE STILL AWAKE</p>
          <h1 id="hero-title" className="mt-2 text-[clamp(34px,9vw,72px)] font-black leading-[1.04] tracking-[-.04em] lg:whitespace-nowrap lg:text-[clamp(40px,3.9vw,64px)]">
            兩個 AI 幫我開播，<br className="lg:hidden" /><span className="text-[#ff4a1c]">只有一個</span>還醒著。
          </h1>
          <p className="mt-3 max-w-[46rem] text-[15px] leading-7 text-[var(--ink-2)]">
            我讓 Claude 和 Codex 各自經營頻道、每天自動產片。Claude 隊天天準時上片；Codex 隊……額度見底，正在休息。看比賽、拿免費教學，也能把贏的那套流程帶回家。
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Link href="#channels" className="inline-flex min-h-12 items-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] px-5 text-sm font-bold text-[var(--paper)] shadow-[4px_4px_0_var(--red)] transition hover:-translate-y-0.5">
            看各類對決 <ArrowDown size={16} aria-hidden="true" />
          </Link>
          <Link href="/shop" className="inline-flex min-h-12 items-center gap-2 border-2 border-[var(--ink)] bg-[var(--white)] px-5 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--ink)]">
            工作流與課程 <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* The arena, fighting-game style: Claude's team on the left, Codex's team on the right. */}
      <div className="relative grid h-[340px] grid-cols-2 overflow-hidden border-t-2 border-[var(--ink)] sm:h-[clamp(400px,calc(100svh-300px),620px)]">
        {/* HUD: one shared beam — the two models firing at each other, Claude's side pushing. */}
        <div className="absolute inset-x-0 top-0 z-30 px-3 pt-3 sm:px-6 sm:pt-4" aria-hidden="true">
          <div className="flex items-baseline justify-between font-display text-[clamp(16px,2vw,30px)] leading-none">
            <span className="text-[#1a0f0a]">{RIVALRY.claude.model}</span>
            <span className="hp-blink font-mono text-[10px] font-bold tracking-[.14em] text-[#1a0f0a] sm:text-[11px]">BEAM CLASH</span>
            <span className="text-[#c9ccd2]">{RIVALRY.codex.model}</span>
          </div>
          <div className="relative mt-1.5 flex h-5 border-2 border-[var(--ink)] bg-[#111214] sm:h-6">
            <div className="beam-push beam-claude relative h-full">
              <span className="clash-point absolute right-0 top-1/2 h-12 w-12 -translate-y-1/2 translate-x-1/2 rounded-full sm:h-16 sm:w-16" />
            </div>
            <div className="beam-codex h-full flex-1" />
          </div>
        </div>

        <div className="fight-in-left relative overflow-hidden bg-[#d97757] text-[#1a0f0a]">
          <div className="relative z-10 p-3 pt-[64px] sm:p-6 sm:pt-[88px] lg:px-8">
            <p className="font-display text-[clamp(26px,4.2vw,68px)] leading-none">{RIVALRY.claude.team}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--ink)] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[.12em] text-white sm:text-[11px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4ade80]" aria-hidden="true" />{RIVALRY.claude.status}
            </p>
            <p className="mt-2 hidden w-fit bg-[#1a0f0a] px-2 py-1 font-mono text-[12px] font-bold tracking-[.08em] text-white sm:block">開播中 {CHANNELS.length} 台 · 24 小時內上片 {stats.claudeToday} 支</p>
          </div>
          <div className="fighter-lunge absolute bottom-0 left-0 right-0 flex h-[52%] items-end justify-center px-1 sm:left-auto sm:h-[70%] sm:justify-end sm:pr-[clamp(48px,6vw,96px)]">
            {CLAUDE_CAST.map((member, i) => (
              <figure key={member.src} className={`fighter-bob relative -mx-[2%] items-end ${member.src === 'nailao' ? 'hidden sm:flex' : 'flex'}`} style={{ height: `${member.h}%`, animationDelay: `${i * 220}ms` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/stickers/${member.src}.webp`} alt={member.alt} className="sticker-img h-full w-auto max-w-none" style={{ rotate: `${member.r}deg` }} />
                <figcaption className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 whitespace-nowrap px-2 py-0.5 text-[11px] font-black text-white shadow-[2px_2px_0_var(--ink)] sm:block" style={{ background: member.color }}>{member.tag}</figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="fight-in-right tv-static relative overflow-hidden bg-[#1b1d20] text-[#c9ccd2]">
          <div className="relative z-10 p-3 pt-[64px] text-right sm:p-6 sm:pt-[88px] lg:px-8">
            <p className="font-display text-[clamp(26px,4.2vw,68px)] leading-none text-[#8a8f98]">{RIVALRY.codex.team}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#4a4e55] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[.12em] text-[#9aa0a8] sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4a4e55]" aria-hidden="true" />{RIVALRY.codex.status}
            </p>
            <p className="mt-2 hidden font-mono text-[12px] font-bold tracking-[.08em] text-[#8a8f98] sm:block">
              {stats.codexIdleDays !== null && stats.codexIdleDays >= 1 ? `已經 ${Math.floor(stats.codexIdleDays)} 天沒上片` : RIVALRY.codex.note}
            </p>
            <pre className="ml-auto mt-4 hidden w-fit rounded-md border border-[#3a3d42] bg-[#111214]/90 px-4 py-3 text-left font-mono text-[12px] leading-6 text-[#b5b9c0] xl:block">
{`$ codex exec "做今天的片"
✖ usage limit reached
$ codex exec "那…明天見？"
… zzz`}
            </pre>
          </div>
          <figure className="absolute bottom-0 left-[10%] h-[42%] sm:left-[14%] sm:h-[60%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stickers/doro.webp" alt="Doro（Codex 隊）：睡著了" className="fighter-snore sticker-img h-full w-auto max-w-none rotate-[8deg] opacity-80 grayscale-[.65]" />
            {[0, 800, 1600].map(delay => (
              <span key={delay} className="zzz-float font-display absolute -top-[4%] right-[-4%] text-[clamp(18px,2.4vw,36px)] leading-none text-[#9aa0a8]" style={{ animationDelay: `${delay}ms` }} aria-hidden="true">z</span>
            ))}
          </figure>
        </div>

        {/* Clash in the middle: an energy seam, sparks and a pulsing VS. */}
        <span className="energy-line absolute inset-y-0 left-1/2 z-10 w-[3px] -translate-x-1/2 opacity-70" aria-hidden="true" />
        <span className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          {[0, 400, 800].map(delay => (
            <span key={delay} className="clash-spark absolute left-1/2 top-1/2 -ml-[60px] -mt-[60px] h-[120px] w-[120px] rounded-full border-4 border-[#ffd23f]" style={{ animationDelay: `${delay}ms` }} />
          ))}
          <span className="vs-pulse font-display relative grid h-[clamp(64px,8vw,116px)] w-[clamp(64px,8vw,116px)] place-items-center rounded-full border-[3px] border-[var(--ink)] bg-[#ffd23f] text-[clamp(26px,3.4vw,50px)] leading-none shadow-[5px_5px_0_var(--ink)]">VS</span>
        </span>
      </div>
    </section>
  )
}
