import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowUpRight, PlayCircle } from 'lucide-react'
import CopyButton from '@/components/site/CopyButton'
import LeadForm from '@/components/site/LeadForm'
import { BackLink, Card, Kicker, Lede, PageTitle } from '@/components/site/ui'
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
  return <>{text.split(/\n{2,}/).map((p, i) => <p key={i} className="mt-4 whitespace-pre-line text-[16px] leading-[1.95] text-[#2a2824]">{p}</p>)}</>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] font-bold tracking-[.16em] text-[var(--ink-2)]">{children}</p>
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
    <main className="px-4 pb-28 pt-12 sm:px-8 sm:pt-20">
      <header className="mx-auto max-w-4xl">
        <BackLink href="/videos">全部影片筆記</BackLink>
        <Kicker color={channel?.color} className="mt-6">EP_{ep} · {channel?.name} · {video.publishedAt.replaceAll('-', '.')}</Kicker>
        <PageTitle>{video.title}</PageTitle>
        <Lede>{video.summary}</Lede>
      </header>

      <div className="mx-auto mt-12 max-w-5xl">
        <div className="overflow-hidden border-[3px] border-[var(--ink)] bg-black shadow-[10px_10px_0_var(--ink)]">
          {embed ? (
            <iframe src={embed} title={video.title} className="aspect-video w-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          ) : (
            <div className="relative flex aspect-video items-center justify-center overflow-hidden" style={{ background: channel?.color ?? 'var(--ink)', color: channel?.ink ?? '#fff' }}>
              <span className="font-display absolute -bottom-[0.2em] right-4 text-[clamp(160px,26vw,320px)] leading-none opacity-20">{ep}</span>
              <div className="relative text-center">
                <PlayCircle size={44} className="mx-auto" aria-hidden="true" />
                <p className="mt-3 font-mono text-xs font-bold tracking-[.16em]">POST-PRODUCTION · 影片即將上線</p>
              </div>
            </div>
          )}
        </div>
        {links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {links.map(([platform, value]) => (
              <a key={platform} href={platformUrl(platform, value)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 border-2 border-[var(--ink)] bg-[var(--white)] px-4 font-mono text-[11px] font-bold tracking-[.08em]">
                {PLATFORM_LABELS[platform]}<ArrowUpRight size={12} aria-hidden="true" />
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <article>
          {video.sections.map((section, index) => (
            <section key={section.heading} className={index ? 'mt-12 border-t border-[var(--rule)] pt-10' : ''}>
              <SectionLabel>SCENE_{String(index + 1).padStart(2, '0')}</SectionLabel>
              <h2 className="mt-3 text-3xl font-black leading-snug">{section.heading}</h2>
              <Paragraphs text={section.body} />
            </section>
          ))}

          {video.prompts.length > 0 && (
            <section className="mt-14 border-t-2 border-[var(--ink)] pt-10">
              <SectionLabel>PROMPT</SectionLabel>
              <h2 className="mt-3 text-3xl font-black">影片裡的 prompt</h2>
              <div className="mt-6 space-y-5">
                {video.prompts.map((prompt, index) => (
                  <Card key={prompt.title} className="overflow-hidden !shadow-[4px_4px_0_var(--ink)]">
                    <div className="flex items-center justify-between gap-3 border-b-2 border-[var(--ink)] px-5 py-3">
                      <p className="font-mono text-[11px] font-bold tracking-[.06em]">TAKE_{String(index + 1).padStart(2, '0')} · {prompt.title}</p>
                      <CopyButton text={prompt.text} />
                    </div>
                    <pre className="whitespace-pre-wrap break-words px-5 py-5 font-mono text-[13px] leading-7">{prompt.text}</pre>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {video.tools.length > 0 && (
            <section className="mt-14 border-t-2 border-[var(--ink)] pt-10">
              <SectionLabel>TOOLS</SectionLabel>
              <h2 className="mt-3 text-3xl font-black">用到的工具</h2>
              <ul className="mt-5 divide-y divide-[var(--rule)] border-y border-[var(--rule)]">
                {video.tools.map(tool => (
                  <li key={tool.name}>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="group flex min-h-14 items-center justify-between gap-4 py-3">
                      <span>
                        <span className="block font-bold">{tool.name}</span>
                        {tool.note && <span className="text-sm text-[var(--ink-2)]">{tool.note}</span>}
                      </span>
                      <ArrowUpRight size={16} className="shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {resource && (
          <Card as="aside" className="p-6 lg:sticky lg:top-24">
            <SectionLabel>FREE · 影片完整資料</SectionLabel>
            <h2 className="mt-3 text-xl font-black leading-snug">{resource.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-2)]">{video.cta.pitch ?? resource.summary}</p>
            <div className="mt-5"><LeadForm resource={resource.slug} title={resource.title} /></div>
          </Card>
        )}
      </div>
    </main>
  )
}
