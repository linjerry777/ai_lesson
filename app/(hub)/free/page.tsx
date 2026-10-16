import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Kicker, Lede, PageTitle } from '@/components/site/ui'
import { getPublishedResources } from '@/lib/content'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `免費教學 | ${SITE.name}`,
  description: '影片裡用到的 prompt 包、模板與檢查清單，留 Email 直接下載。',
  alternates: { canonical: '/free' },
}

export default function FreePage() {
  const resources = getPublishedResources()
  return (
    <main className="relative overflow-hidden px-4 pb-28 pt-16 sm:px-8 sm:pt-24">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/stickers/mochi-love.webp" alt="" className="sticker-img pointer-events-none absolute right-[4%] top-12 hidden w-40 rotate-[8deg] md:block" />
      <div className="mx-auto max-w-[1200px]">
        <Kicker color="#ff5d8f">FREE / DOWNLOADS</Kicker>
        <PageTitle>免費教學</PageTitle>
        <Lede>影片裡用到的完整資料都在這裡。留 Email 就能下載，之後有新版，用同一個 Email 再拿一次。</Lede>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {resources.map((resource, index) => (
            <Link key={resource.slug} href={`/free/${resource.slug}`} className="group flex flex-col border-2 border-[var(--ink)] bg-[var(--white)] p-7 shadow-[6px_6px_0_var(--ink)] transition duration-200 hover:-translate-y-1 hover:shadow-[8px_10px_0_var(--ink)]">
              <div className="flex items-center justify-between font-mono text-[11px] font-bold tracking-[.12em]">
                <span className="bg-[#ff5d8f] px-2 py-0.5 text-white">FREE_{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[var(--ink-2)]">{resource.format}</span>
              </div>
              <h2 className="mt-5 text-2xl font-black leading-snug">{resource.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[var(--ink-2)]">{resource.summary}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold">免費取得 <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
