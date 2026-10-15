import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/sections/Footer'
import LeadForm from '@/components/hub/LeadForm'
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
    <>
      <Navbar />
      <main className="min-h-screen bg-paper px-4 pb-20 pt-24 text-ink sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-2xl">
          <Link href="/free" className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink"><ArrowLeft size={14} aria-hidden="true" />全部免費資源</Link>
          <p className="mt-2 text-[11px] font-semibold tracking-[0.14em] text-rust">免費下載 · {resource.format}</p>
          <h1 className="mt-3 text-[clamp(26px,5vw,40px)] font-bold leading-tight tracking-tight">{resource.title}</h1>
          <p className="mt-4 text-[15px] leading-8 text-ink-muted">{resource.summary}</p>
          <ul className="mt-6 space-y-3">
            {resource.bullets.map(item => <li key={item} className="flex gap-2.5 text-sm leading-7"><Check size={17} className="mt-1 shrink-0 text-[#5c795f]" aria-hidden="true" />{item}</li>)}
          </ul>
          <div className="mt-8 rounded-xl border border-[#d9dbd0] bg-[#fffefa] p-5 shadow-[6px_6px_0_#e8e7dd] sm:p-6">
            <LeadForm resource={resource.slug} title={resource.title} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
