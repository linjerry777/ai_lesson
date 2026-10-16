import { ArrowUpRight } from 'lucide-react'
import { CHANNELS, PLATFORM_LABELS, pad2, slotLabel, type Channel, type PlatformKey } from '@/lib/site'
import ClipVideo from '@/components/site/ClipVideo'
import Schedule from '@/components/site/Schedule'
import { Kicker } from '@/components/site/ui'

function Slot({ c, i }: { c: Channel; i: number }) {
  const links = Object.entries(c.links) as [PlatformKey, string][]
  return (
    <article id={`ch-${c.key}`} data-slot={i} className="grid scroll-mt-16 border-t-2 border-[var(--ink)] lg:min-h-[88svh] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="reveal flex flex-col justify-center px-4 py-12 sm:px-8 lg:py-16 lg:pl-[max(2rem,calc((100vw-1440px)/2+2rem))]">
        <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] font-bold tracking-[.16em]">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} aria-hidden="true" />
          CH {pad2(i + 1)}
          <span className="h-3 w-px bg-[var(--ink)]" aria-hidden="true" />
          <span className="text-[var(--ink-2)]">{c.code}</span>
        </p>
        {c.hour !== undefined ? (
          <p className="font-display text-outline mt-4 text-[clamp(92px,12.5vw,210px)] leading-[.86]" aria-label={`每天 ${slotLabel(c)} 發片`}>{slotLabel(c)}</p>
        ) : (
          <p className="mt-4 flex items-end gap-4">
            <span className="font-display text-outline text-[clamp(92px,12.5vw,210px)] leading-[.86]" aria-hidden="true">SOON</span>
            <span className="mb-3 bg-[var(--ink)] px-2 py-1 text-sm font-bold text-[var(--paper)]">{c.note}</span>
          </p>
        )}
        <h3 className="mt-3 text-[clamp(52px,6.6vw,112px)] font-black leading-[1] tracking-[-.04em]">{c.name}</h3>
        <p className="mt-4 text-xl font-bold leading-snug sm:text-2xl">{c.tagline}</p>
        <p className="mt-3 max-w-md text-[15px] leading-7 text-[var(--ink-2)]">{c.description}</p>
        {c.credit && <p className="mt-5 border-y border-[var(--rule)] py-2 font-mono text-[11px] font-bold tracking-[.14em]">{c.credit}</p>}
        <div className="mt-6 flex flex-wrap gap-2.5">
          {links.length ? links.map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 border-2 border-[var(--ink)] bg-[var(--white)] px-4 font-mono text-[12px] font-bold tracking-[.1em] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink)]">
              {PLATFORM_LABELS[platform].toUpperCase()} <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )) : (
            <span className="inline-flex min-h-11 items-center border-2 border-dashed border-[var(--ink)] px-4 font-mono text-[12px] font-bold tracking-[.1em] text-[var(--ink-2)]">頻道整理中 · COMING SOON</span>
          )}
        </div>
      </div>

      <div className="relative flex min-h-[560px] items-center justify-center overflow-hidden px-6 py-14 lg:min-h-0" style={{ background: c.color, color: c.ink }}>
        <span className="font-display pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] select-none text-[clamp(220px,34vw,520px)] leading-none opacity-[.13]" aria-hidden="true">{pad2(i + 1)}</span>
        <span className="absolute right-4 top-1/2 hidden -translate-y-1/2 font-mono text-[11px] font-bold tracking-[.3em] [writing-mode:vertical-rl] sm:block" aria-hidden="true">
          SLOT {pad2(i + 1)} / {pad2(CHANNELS.length)}
        </span>
        <div className={`reveal relative w-[min(68vw,300px)]`}>
          <div className={`relative overflow-hidden border-[3px] border-[var(--ink)] bg-black shadow-[10px_10px_0_var(--ink)] aspect-[9/16]`}>
            <ClipVideo name={c.clip} label={`${c.name} 片段`} className="h-full w-full object-cover" />
            <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-black/55 px-2 py-1 font-mono text-[10px] font-bold tracking-[.14em] text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--red)]" aria-hidden="true" />REC · {c.code}
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/stickers/${c.sticker}.webp`}
            alt=""
            loading="lazy"
            className={`sticker-img pointer-events-none absolute -right-[30%] bottom-[-8%] w-[56%] sm:-right-[58%] sm:bottom-[-6%] sm:w-[78%]`}
            style={{ transform: `rotate(${i % 2 ? -7 : 6}deg)${c.mirror ? ' scaleX(-1)' : ''}` }}
          />
        </div>
      </div>
    </article>
  )
}

export default function Channels() {
  return (
    <section id="channels" className="scroll-mt-16 pt-20" aria-labelledby="channels-title">
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 pb-14 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Kicker>01 — PROGRAMME / 今日節目表</Kicker>
          <h2 id="channels-title" className="mt-5 text-[clamp(34px,8.6vw,104px)] font-black leading-[1] tracking-[-.04em]">五個頻道，<br />從早播到晚。</h2>
        </div>
        <p className="max-w-sm text-[15px] leading-7 text-[var(--ink-2)]">往下滑，時間會往前走。時段是每天實際發片的時間（台北），影片片段都是頻道裡播出的內容。</p>
      </div>
      <Schedule>
        {CHANNELS.map((c, i) => <Slot key={c.key} c={c} i={i} />)}
      </Schedule>
    </section>
  )
}
