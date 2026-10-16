import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LeadForm from '@/components/site/LeadForm'
import { BackLink, Card, Kicker, Lede, PageTitle } from '@/components/site/ui'
import { getPublishedResources, getResource } from '@/lib/content'
import { SITE } from '@/lib/site'

export function generateStaticParams() {
  return getPublishedResources().map(resource => ({ slug: resource.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resource = getResource((await params).slug)
  if (!resource) return {}
  return {
    title: `${resource.title}（免費下載） | ${SITE.name}`,
    description: resource.summary,
    alternates: { canonical: `/free/${resource.slug}` },
  }
}

export default async function FreeResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const resource = getResource((await params).slug)
  if (!resource) notFound()
  return (
    <main className="px-4 pb-28 pt-12 sm:px-8 sm:pt-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div>
          <BackLink href="/free">全部免費教學</BackLink>
          <Kicker color="#ff5d8f" className="mt-6">FREE · {resource.format}</Kicker>
          <PageTitle>{resource.title}</PageTitle>
          <Lede>{resource.summary}</Lede>
          <ol className="mt-10 border-t-2 border-[var(--ink)]">
            {resource.bullets.map((item, index) => (
              <li key={item} className="flex gap-5 border-b border-[var(--rule)] py-5">
                <span className="font-display text-2xl leading-none text-[#ff5d8f]">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[16px] leading-7">{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="relative mt-20 lg:sticky lg:top-32 lg:mt-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stickers/mochi-love.webp" alt="" className="sticker-img pointer-events-none absolute bottom-full right-3 z-10 w-24 translate-y-[28%] rotate-[8deg]" />
          <Card as="aside" className="p-7">
            <p className="pr-24 font-mono text-[11px] font-bold tracking-[.16em] text-[var(--ink-2)]">TICKET · 免費取得</p>
            <p className="mt-3 pr-20 text-2xl font-black">留下 Email，馬上下載</p>
            <p className="mt-2 text-sm leading-7 text-[var(--ink-2)]">不用登入，也不用等收信。開賣通知與新版也會寄到這個 Email。</p>
            <div className="mt-6"><LeadForm resource={resource.slug} title={resource.title} /></div>
          </Card>
        </div>
      </div>
    </main>
  )
}
