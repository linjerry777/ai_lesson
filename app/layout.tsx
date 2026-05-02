import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ailesson-two.vercel.app'
const TITLE = 'Claude Code 實戰工作流 | 打造 AI 時代的工程師超能力'
const DESCRIPTION =
  '不是工具功能大全——是矽谷工程師真正在用的 AI 開發方法論。帶你從需求拆解到部署，完整學習 Claude Code × MCP × Hook × Sub-Agent，真正交付成果。'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['Claude Code', 'AI 開發', 'MCP', 'Hook', 'Sub-Agent', '工程師', 'AI 工作流'],
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: SITE_URL,
    siteName: '網課小韭菜',
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

// JSON-LD Course schema → Google rich results。價格依 Hero 顯示的 NT$2,640。
const courseJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Claude Code 實戰工作流',
  description: DESCRIPTION,
  provider: {
    '@type': 'Organization',
    name: '網課小韭菜',
    url: SITE_URL,
  },
  url: SITE_URL,
  inLanguage: 'zh-TW',
  educationalLevel: 'Intermediate',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: 'PT4H',
  },
  offers: {
    '@type': 'Offer',
    price: '2640',
    priceCurrency: 'TWD',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/#pricing`,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
