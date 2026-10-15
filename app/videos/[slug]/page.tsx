import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, PlayCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/sections/Footer'
import CopyButton from '@/components/hub/CopyButton'
import LeadForm from '@/components/hub/LeadForm'
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
  return <>{text.split(/\n{2,}/).map((paragraph, index) => <p key={index} className="mt-3 whitespace-pre-line text-[15px] leading-8 text-[#3c4a4c]">{paragraph}</p>)}</>
}

export default async function VideoPage({ params }: { params: Promise<{ slug: string }> }) {
  const video = getVideo((await params).slug)
  if (!video) notFound()
  const resource = getResource(video.cta.slug)
  const channel = getChannel(video.channel)
  const links = (Object.entries(video.platforms) as [PlatformKey, string][])
  const embed = video.platforms.youtube
    ? `https://www.youtube-nocookie.com/embed/${video.platforms.youtube}`
    : video.platforms.bilibili
      ? `https://player.bilibili.com/player.html?bvid=${video.platforms.bilibili}&autoplay=0`
      : null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-paper px-4 pb-20 pt-24 text-ink sm:px-6 sm:pt-28">
        <article className="mx-auto max-w-3xl">
          <Link href="/videos" className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"><ArrowLeft size={14} aria-hidden="true" />全部影片</Link>
          <p className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-rust">#{video.code.toUpperCase()} · {channel?.name} · {video.publishedAt}</p>
          <h1 className="mt-3 text-[clamp(26px,5vw,40px)] font-bold leading-tight tracking-tight">{video.title}</h1>
          <p className="mt-4 text-[15px] leading-8 text-ink-muted">{video.summary}</p>

          <div className="mt-6 overflow-hidden rounded-lg border border-[#d9dbd0] bg-ink">
            {embed ? (
              <iframe src={embed} title={video.title} className="aspect-video w-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 text-[#c0d0cd]"><PlayCircle size={36} aria-hidden="true" /><span className="text-xs">影片即將上線</span></div>
            )}
          </div>
          {links.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {links.map(([platform, value]) => (
                <a key={platform} href={platformUrl(platform, value)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#d9dbd0] bg-white px-3 text-xs font-semibold hover:border-ink">
                  在 {PLATFORM_LABELS[platform]} 觀看<ExternalLink size={12} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}

          {resource && (
            <aside className="mt-8 rounded-xl border border-[#d9dbd0] bg-[#fffefa] p-5 shadow-[6px_6px_0_#e8e7dd] sm:p-6" aria-label="免費資源">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-rust">影片裡的完整資料 · 免費</p>
              <h2 className="mt-2 text-lg font-semibold">{resource.title}</h2>
              <p className="mt-2 text-sm leading-7 text-ink-muted">{video.cta.pitch ?? resource.summary}</p>
              <div className="mt-4"><LeadForm resource={resource.slug} title={resource.title} compact /></div>
            </aside>
          )}

          {video.sections.map(section => (
            <section key={section.heading} className="mt-10">
              <h2 className="text-xl font-semibold">{section.heading}</h2>
              <Paragraphs text={section.body} />
            </section>
          ))}

          {video.prompts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold">影片裡的 prompt</h2>
              <div className="mt-4 space-y-4">
                {video.prompts.map(prompt => (
                  <div key={prompt.title} className="rounded-lg border-l-[3px] border-[#bf673b] bg-rust-soft p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#915329]">{prompt.title}</p>
                      <CopyButton text={prompt.text} />
                    </div>
                    <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-[13px] leading-7 text-ink">{prompt.text}</pre>
                  </div>
                ))}
              </div>
            </section>
          )}

          {video.tools.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-semibold">用到的工具</h2>
              <ul className="mt-4 divide-y divide-[#e0dfd4] rounded-lg border border-[#e0dfd4] bg-white">
                {video.tools.map(tool => (
                  <li key={tool.name} className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="text-sm font-semibold">{tool.name}</p>
                      {tool.note && <p className="mt-1 text-xs text-ink-muted">{tool.note}</p>}
                    </div>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-xs font-semibold text-rust hover:underline">官網<ExternalLink size={12} aria-hidden="true" /></a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
