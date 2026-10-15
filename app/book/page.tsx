import type { Metadata } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import PopupBook from '@/components/popup/PopupBook'
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

export default function BookPage() {
  const resource = getPublishedResources()[0] ?? null
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <PopupBook
        resource={resource && { slug: resource.slug, title: resource.title, format: resource.format }}
        product={{ name: 'AutoVideo 工作流套件', tagline: '填好設定，一個指令跑出第一支片。', price: 'NT$790' }}
      />
    </div>
  )
}
