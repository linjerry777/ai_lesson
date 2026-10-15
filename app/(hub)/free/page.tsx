import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import styles from '@/components/cinema/cinema.module.css'
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
    <main className="px-4 pb-28 pt-32 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Bonus Features · 附錄</p>
        <h1 className={`${styles.display} mt-4 text-[clamp(36px,6vw,64px)] leading-tight text-[#ece7dd]`}>免費資源</h1>
        <p className={`${styles.subtitle} mt-5 max-w-xl text-base leading-8`}>—— 影片裡用到的完整資料都在這。留 Email 就能下載，有新版用同一個 Email 再拿一次。</p>
        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {resources.map((resource, index) => (
            <Link key={resource.slug} href={`/free/${resource.slug}`} className={`${styles.glass} group flex flex-col rounded-2xl p-7 transition hover:border-[#f0a65a]/50`}>
              <div className="flex items-center justify-between">
                <span className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Bonus {String(index + 1).padStart(2, '0')}</span>
                <span className={`${styles.mono} text-[10px] text-[#7d858f]`}>{resource.format}</span>
              </div>
              <h2 className={`${styles.display} mt-5 text-2xl leading-snug text-[#ece7dd]`}>{resource.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-7 text-[#9aa3ad]">{resource.summary}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-[#f0a65a]">免費取得<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
