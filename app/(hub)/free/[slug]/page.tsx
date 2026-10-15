import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import LeadForm from '@/components/cinema/LeadForm'
import styles from '@/components/cinema/cinema.module.css'
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
    <main className="px-4 pb-28 pt-28 sm:px-6 sm:pt-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div>
          <Link href="/free" className={`${styles.mono} inline-flex min-h-11 items-center gap-2 text-[10px] text-[#9aa3ad] hover:text-white`}><ArrowLeft size={14} aria-hidden="true" />全部免費資源</Link>
          <p className={`${styles.mono} mt-4 text-[10px] text-[#f0a65a]`}>Free · {resource.format}</p>
          <h1 className={`${styles.display} mt-4 text-[clamp(32px,5.4vw,56px)] leading-[1.18] text-[#ece7dd]`}>{resource.title}</h1>
          <p className={`${styles.subtitle} mt-6 text-[17px] leading-8`}>—— {resource.summary}</p>
          <ol className="mt-10 space-y-5">
            {resource.bullets.map((item, index) => (
              <li key={item} className="flex gap-5 border-t border-white/10 pt-5">
                <span className={`${styles.display} text-2xl leading-none text-[#f0a65a]`}>{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[15px] leading-7 text-[#c9ced3]">{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <aside className={`${styles.glass} rounded-2xl p-6 sm:p-8 lg:sticky lg:top-28`} aria-label="下載表單">
          <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Ticket · 免費入場</p>
          <p className={`${styles.display} mt-3 text-2xl text-[#ece7dd]`}>留下 Email，馬上下載</p>
          <p className="mt-3 text-sm leading-7 text-[#9aa3ad]">不用登入，也不用等收信。之後有新版，用同一個 Email 再填一次就好。</p>
          <div className="mt-6"><LeadForm resource={resource.slug} title={resource.title} /></div>
        </aside>
      </div>
    </main>
  )
}
