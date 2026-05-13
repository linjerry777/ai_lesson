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
const TITLE = 'Claude Code 實戰工作流 | 做出可登入、可付款、可部署的產品網站'
const DESCRIPTION =
  '一堂文字版 AI 實作課：用 Claude Code 建出 Landing Page、Google 登入、Stripe 付款、購買紀錄、Dashboard 與 Vercel 部署流程。'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: ['Claude Code', 'AI 開發', 'Stripe Checkout', 'Supabase Auth', 'Vercel 部署', 'AI 工作流'],
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
    price: '990',
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
