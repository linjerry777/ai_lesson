import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import CopyButton from '@/components/cinema/CopyButton'
import LeadForm from '@/components/cinema/LeadForm'
import styles from '@/components/cinema/cinema.module.css'
import { getPublishedVideos, getResource, getVideo } from '@/lib/content'
import { PLATFORM_LABELS, SITE, getChannel, type PlatformKey } from '@/lib/site'

export function generateStaticParams() {
  return getPublishedVideos().map(video => ({ slug: video.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const video = getVideo((await params).slug)
  if (!video) return {}
  return {
    title: `${video.title} | ${SITE.name}`,
    description: video.summary,
    alternates: { canonical: `/videos/${video.slug}` },
    openGraph: { title: video.title, description: video.summary, type: 'article' },
  }
}

function platformUrl(platform: PlatformKey, value: string) {
  if (platform === 'youtube') return `https://www.youtube.com/watch?v=${value}`
  if (platform === 'bilibili') return `https://www.bilibili.com/video/${value}`
  return value
}

function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n{2,}/).map((paragraph, index) => <p key={index} className="mt-4 whitespace-pre-line text-[16px] leading-[1.95] text-[#c9ced3]">{paragraph}</p>)}</>
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const video = getVideo((await params).slug)
  if (!video) notFound()
  const resource = getResource(video.cta.slug)
  const channel = getChannel(video.channel)
  const ep = video.code.padStart(2, '0').toUpperCase()
  const links = Object.entries(video.platforms) as [PlatformKey, string][]
  const embed = video.platforms.youtube
    ? `https://www.youtube-nocookie.com/embed/${video.platforms.youtube}`
    : video.platforms.bilibili
      ? `https://player.bilibili.com/player.html?bvid=${video.platforms.bilibili}&autoplay=0`
      : null

  return (
    <main className="px-4 pb-28 pt-28 sm:px-6 sm:pt-32">
      <article className="mx-auto max-w-3xl">
        <Link href="/videos" className={`${styles.mono} inline-flex min-h-11 items-center gap-2 text-[10px] text-[#9aa3ad] hover:text-white`}><ArrowLeft size={14} aria-hidden="true" />回到片單</Link>
        <p className={`${styles.mono} mt-4 text-[10px] text-[#f0a65a]`}>EP.{ep} · {channel?.name} · {video.publishedAt.replaceAll('-', '.')}</p>
        <h1 className={`${styles.display} mt-4 text-[clamp(30px,5.4vw,52px)] leading-[1.2] text-[#ece7dd]`}>{video.title}</h1>
        <p className={`${styles.subtitle} mt-6 text-[17px] leading-8`}>—— {video.summary}</p>
      </article>

      <div className="mx-auto mt-12 max-w-5xl">
        <div className="relative overflow-hidden rounded-sm bg-black shadow-[0_40px_120px_-40px_rgba(0,0,0,.95)] ring-1 ring-white/10">
          {embed ? (
            <iframe src={embed} title={video.title} className="aspect-video w-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          ) : (
            <div className={`${styles.poster} ${styles.scanlines} relative flex aspect-video items-center justify-center`}>
              <span className={`${styles.display} ${styles.outlineNum} absolute right-6 top-1/2 -translate-y-1/2 text-[clamp(120px,22vw,260px)] leading-none`}>{ep}</span>
              <div className="relative text-center">
                <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}><span className={styles.rec} /> &nbsp;Post-production</p>
                <p className={`${styles.subtitle} mt-3 text-lg`}>影片剪輯中，即將上映</p>
              </div>
            </div>
          )}
        </div>
        {links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {links.map(([platform, value]) => (
              <a key={platform} href={platformUrl(platform, value)} target="_blank" rel="noopener noreferrer" className={`${styles.mono} inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/15 px-4 text-[10px] text-[#b9bec4] hover:border-white/40 hover:text-white`}>
                {PLATFORM_LABELS[platform]}<ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-3xl">
        {resource && (
          <aside className={`${styles.glass} mt-14 rounded-2xl p-6 sm:p-8`} aria-label="免費資源">
            <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Free · 影片裡的完整資料</p>
            <h2 className={`${styles.display} mt-3 text-2xl text-[#ece7dd]`}>{resource.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#9aa3ad]">{video.cta.pitch ?? resource.summary}</p>
            <div className="mt-6"><LeadForm resource={resource.slug} title={resource.title} compact /></div>
          </aside>
        )}

        {video.sections.map((section, index) => (
          <section key={section.heading} className="mt-16">
            <p className={`${styles.mono} text-[10px] text-[#7d858f]`}>Scene {String(index + 1).padStart(2, '0')}</p>
            <h2 className={`${styles.display} mt-2 text-[26px] leading-snug text-[#ece7dd]`}>{section.heading}</h2>
            <Paragraphs text={section.body} />
          </section>
        ))}

        {video.prompts.length > 0 && (
          <section className="mt-20">
            <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Script · 劇本</p>
            <h2 className={`${styles.display} mt-2 text-[26px] text-[#ece7dd]`}>影片裡的 prompt</h2>
            <div className="mt-6 space-y-5">
              {video.prompts.map((prompt, index) => (
                <div key={prompt.title} className="overflow-hidden rounded-lg border border-white/10 bg-[#0b0e13]/90">
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
                    <p className={`${styles.mono} text-[10px] text-[#b9bec4]`}>INT. 你的終端機 — 夜 · Take {String(index + 1).padStart(2, '0')} · {prompt.title}</p>
                    <CopyButton text={prompt.text} />
                  </div>
                  <pre className="whitespace-pre-wrap break-words px-5 py-5 font-[family-name:var(--font-mono)] text-[13px] leading-7 text-[#e6dccb]">{prompt.text}</pre>
                </div>
              ))}
            </div>
          </section>
        )}

        {video.tools.length > 0 && (
          <section className="mt-20">
            <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Cast · 演出工具</p>
            <h2 className={`${styles.display} mt-2 text-[26px] text-[#ece7dd]`}>用到的工具</h2>
            <ul className="mt-6 space-y-4">
              {video.tools.map(tool => (
                <li key={tool.name}>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" className="group flex items-end gap-3">
                    <span className="text-[17px] text-[#ece7dd] group-hover:text-[#f0a65a]">{tool.name}</span>
                    <span className={styles.leader} />
                    <span className="max-w-[55%] text-right text-sm text-[#9aa3ad]">{tool.note ?? '官網'}</span>
                    <ArrowUpRight size={14} className="mb-1 shrink-0 text-[#7d858f] group-hover:text-[#f0a65a]" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  )
}
