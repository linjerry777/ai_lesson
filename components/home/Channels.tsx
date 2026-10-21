import { ArrowUpRight } from 'lucide-react'
import ClipVideo from '@/components/site/ClipVideo'
import VideoReel from '@/components/site/VideoReel'
import { Kicker } from '@/components/site/ui'
import { CHANNELS, CODEX_CHANNELS, MATCHUPS, PLATFORM_LABELS, RIVALRY, getChannel, slotLabel, type PlatformKey } from '@/lib/site'
import { ago, daysSince, type LatestVideo } from '@/lib/youtube'

export type Feeds = Record<string, LatestVideo[]>

const views = (n: number | null) => (n === null ? '—' : n.toLocaleString('en-US'))
const total = (videos: LatestVideo[]) => videos.reduce((sum, video) => sum + (video.views ?? 0), 0)

function Links({ links, dark }: { links: Partial<Record<PlatformKey, string>>; dark?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.entries(links) as [PlatformKey, string][]).map(([platform, url]) => (
        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-9 items-center gap-1 border px-2.5 font-mono text-[11px] font-bold tracking-[.08em] transition hover:-translate-y-0.5 ${dark ? 'border-[#4a4e55] text-[#c9ccd2]' : 'border-[var(--ink)] bg-[var(--white)]'}`}>
          {PLATFORM_LABELS[platform]} <ArrowUpRight size={12} aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

interface SideProps {
  id: string
  team: 'claude' | 'codex'
  name: string
  tagline: string
  sticker?: string
  color: string
  links: Partial<Record<PlatformKey, string>>
  videos: LatestVideo[]
  now: number
}

/** One channel in a round: who it is, its newest upload and the two before it. */
function Side({ id, team, name, tagline, sticker, color, links, videos, now }: SideProps) {
  const dark = team === 'codex'
  const latest = videos[0]
  const idle = latest ? daysSince(latest.publishedAt, now) : null
  return (
    <article id={id} className={`relative min-w-0 scroll-mt-20 border-2 border-[var(--ink)] p-4 sm:p-5 ${dark ? 'tv-static bg-[#1b1d20] text-[#c9ccd2]' : 'bg-[var(--white)]'}`}>
      <div className="relative z-10">
        <header className="flex items-start gap-3">
          {sticker ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/stickers/${sticker}.webp`} alt="" loading="lazy" className={`sticker-img h-16 w-auto shrink-0 ${dark ? 'opacity-80 grayscale-[.6]' : ''}`} />
          ) : (
            <span className="grid h-16 w-12 shrink-0 place-items-center border-2 border-[#4a4e55] font-mono text-[9px] font-bold leading-tight text-[#6b7079]">NO<br />SIG</span>
          )}
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[.14em]" style={{ color: dark ? '#8a8f98' : color }}>
              {dark ? RIVALRY.codex.team : RIVALRY.claude.team}
              {dark && idle !== null && idle >= 1.5 && <span className="rounded-full bg-[#3a3d42] px-2 py-0.5 text-[#c9ccd2]">停更 {Math.floor(idle)} 天</span>}
              {!dark && <span className="rounded-full bg-[var(--ink)] px-2 py-0.5 text-white">ON AIR</span>}
            </p>
            <h3 className={`mt-1 text-[clamp(24px,2.4vw,36px)] font-black leading-none ${dark ? 'text-[#e2e4e8]' : ''}`}>{name}</h3>
            <p className={`mt-1 text-sm font-bold ${dark ? 'text-[#8a8f98]' : 'text-[var(--ink-2)]'}`}>{tagline}</p>
          </div>
        </header>

        {videos.length ? (
          <div className="mt-4">
            <VideoReel videos={videos} dark={dark} labels={videos.map((video, i) => `${i === 0 ? 'LATEST' : `#${i + 1}`} · ${ago(video.publishedAt, now)}`)} />
          </div>
        ) : (
          <p className="mt-4 text-sm opacity-70">暫時讀不到這個頻道的最新影片。</p>
        )}
        <div className="mt-4"><Links links={links} dark={dark} /></div>
      </div>
    </article>
  )
}

/** Who is ahead in a round: a stalled channel loses; otherwise recent views decide. */
function verdict(claudeName: string, codexName: string, claude: LatestVideo[], codex: LatestVideo[], now: number) {
  const idle = codex[0] ? daysSince(codex[0].publishedAt, now) : null
  if (idle !== null && idle >= 1.5) return `${codexName} 已經 ${Math.floor(idle)} 天沒上片，${claudeName} 繼續每天更新。`
  const a = total(claude)
  const b = total(codex)
  if (!a && !b) return '兩邊都在更新，比分整理中。'
  return a >= b ? `近 3 支觀看 ${claudeName} 領先。` : `近 3 支觀看 ${codexName} 暫時領先，Claude 隊要加油。`
}

export default function Channels({ feeds, now }: { feeds: Feeds; now: number }) {
  const nailao = getChannel('nailao')!
  return (
    <section id="channels" className="scroll-mt-16 border-b-2 border-[var(--ink)] px-4 py-16 sm:px-8 lg:py-20" aria-labelledby="channels-title">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Kicker color="#d97757">01 — THE MATCH / 同類對決</Kicker>
            <h2 id="channels-title" className="mt-3 text-[clamp(30px,4.2vw,64px)] font-black leading-[1.04] tracking-[-.04em]">
              同一個類型，看<span className="text-[var(--red)]">誰還在更新</span>。
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-7 text-[var(--ink-2)]">兩隊用同一個人的帳號、同一套查證與檢查標準。下面是兩邊頻道在 YouTube 上的最新影片，每 30 分鐘自動更新。</p>
        </div>

        <div className="mt-10 space-y-12">
          {MATCHUPS.map(match => {
            const claude = getChannel(match.claude)!
            const codex = CODEX_CHANNELS.find(c => c.key === match.codex)!
            const claudeVideos = feeds[claude.key] ?? []
            const codexVideos = feeds[codex.key] ?? []
            const a = total(claudeVideos)
            const b = total(codexVideos)
            const share = a + b ? Math.round((a / (a + b)) * 100) : 50
            return (
              <div key={match.key} className="reveal">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--ink)] pb-2">
                  <p className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] font-bold tracking-[.16em] text-[var(--ink-2)]">{match.round}</span>
                    <span className="text-2xl font-black">{match.label}</span>
                  </p>
                  <p className="text-sm font-bold">{verdict(claude.name, codex.name, claudeVideos, codexVideos, now)}</p>
                </div>
                <div className="mt-4 grid grid-cols-[minmax(0,1fr)] items-stretch gap-3 lg:grid-cols-[minmax(0,1fr)_72px_minmax(0,1fr)]">
                  <Side id={`ch-${claude.key}`} team="claude" name={claude.name} tagline={`${claude.tagline} · 每天 ${slotLabel(claude)}`} sticker={claude.sticker} color={claude.color} links={claude.links} videos={claudeVideos} now={now} />
                  <div className="flex items-center justify-center" aria-hidden="true">
                    <span className="font-display text-outline text-[clamp(40px,4vw,64px)] leading-none">VS</span>
                  </div>
                  <Side id={`ch-${codex.key}`} team="codex" name={codex.name} tagline={codex.tagline} sticker={codex.sticker} color="#8a8f98" links={codex.links} videos={codexVideos} now={now} />
                </div>
                <div className="mt-3">
                  <div className="flex justify-between font-mono text-[11px] font-bold tabular-nums">
                    <span>{claude.name} {views(a)}</span>
                    <span className="text-[var(--ink-2)]">近 3 支觀看合計</span>
                    <span>{views(b)} {codex.name}</span>
                  </div>
                  <div className="mt-1 flex h-2.5 overflow-hidden border border-[var(--ink)]" role="img" aria-label={`近 3 支觀看：${claude.name} ${a}，${codex.name} ${b}`}>
                    <span style={{ width: `${share}%`, background: claude.color }} />
                    <span className="flex-1 bg-[#3a3d42]" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 奶烙 has no rival: it is the talk channel, hosted by the cat and voiced by Jerry. */}
        <article id="ch-nailao" className="reveal mt-14 grid scroll-mt-20 items-center gap-6 border-2 border-[var(--ink)] p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-6 lg:grid-cols-[auto_minmax(0,1fr)_auto]" style={{ background: nailao.color, color: nailao.ink }}>
          <div className="relative mx-auto w-[150px] sm:mx-0">
            <div className="aspect-[9/16] overflow-hidden border-[3px] border-[var(--ink)] bg-black shadow-[6px_6px_0_var(--ink)]">
              <ClipVideo name={nailao.clip} label={`${nailao.name} 片段`} className="h-full w-full object-cover" />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[.16em]">SOLO · {nailao.credit}</p>
            <h3 className="mt-1 text-[clamp(36px,4vw,60px)] font-black leading-none">{nailao.name}</h3>
            <p className="mt-2 text-xl font-bold">{nailao.tagline}</p>
            <p className="mt-2 max-w-xl text-[15px] leading-7">{nailao.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="bg-[var(--ink)] px-2 py-1 text-sm font-bold text-[var(--paper)]">{nailao.note}</span>
              <Links links={nailao.links} />
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/stickers/${nailao.sticker}.webp`} alt="" loading="lazy" className="sticker-img hidden h-[220px] w-auto rotate-3 lg:block" />
        </article>
        <p className="mt-4 font-mono text-[11px] text-[var(--ink-2)]">Claude 隊目前開播 {CHANNELS.length} 台；Codex 隊的兩台頻道排程暫停中。觀看數取自 YouTube 公開資料。</p>
      </div>
    </section>
  )
}
