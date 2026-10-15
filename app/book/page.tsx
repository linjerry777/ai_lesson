import type { Metadata } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import PopupBook from '@/components/popup/PopupBook'
import BookExperience from '@/components/book3d/BookExperience'
import { getPublishedResources } from '@/lib/content'
import { SITE } from '@/lib/site'

const serif = Noto_Serif_TC({ weight: ['500', '700'], variable: '--font-serif-tc', display: 'swap', preload: false })
const sans = Noto_Sans_TC({ weight: ['400', '500', '700'], variable: '--font-sans-tc', display: 'swap', preload: false })

export const metadata: Metadata = {
  title: `Jerry 的 AI 頻道 | ${SITE.name}`,
  description: SITE.description,
  // Prototype: keep it out of search results until it replaces the homepage.
  robots: { index: false, follow: false },
}

const PRODUCT = { name: 'AutoVideo 工作流套件', tagline: '填好設定，一個指令跑出第一支片。', price: 'NT$790' }

export default async function BookPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams
  const first = getPublishedResources()[0]
  const resource = first ? { slug: first.slug, title: first.title, format: first.format } : null
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      {mode === 'css'
        ? <PopupBook resource={resource} product={PRODUCT} />
        : <BookExperience resource={resource} product={PRODUCT} />}
    </div>
  )
}
