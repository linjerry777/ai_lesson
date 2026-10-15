import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/sections/Footer'
import { getPublishedResources } from '@/lib/content'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `免費資源 | ${SITE.name}`,
  description: '影片裡用到的 prompt 包、模板與檢查清單，留 Email 直接下載。',
  alternates: { canonical: '/free' },
}

export default function FreePage() {
  const resources = getPublishedResources()
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-paper px-4 pb-20 pt-28 text-ink sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-rust">免費下載</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">免費資源</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink-muted">影片裡用到的完整資料都整理在這裡。留 Email 就能下載，之後有新版用同一個 Email 再拿一次。</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {resources.map(resource => (
              <Link key={resource.slug} href={`/free/${resource.slug}`} className="group rounded-lg border border-[#e0dfd4] bg-white p-6 hover:border-ink">
                <p className="text-xs font-semibold text-rust">{resource.format}</p>
                <h2 className="mt-2 text-lg font-semibold group-hover:underline group-hover:underline-offset-4">{resource.title}</h2>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{resource.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">免費下載<ArrowRight size={15} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
