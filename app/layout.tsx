import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { SITE, SITE_URL } from '@/lib/site'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const TITLE = `${SITE.name} | ${SITE.tagline}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: SITE.description,
  keywords: ['Claude Code', 'AI 工作流', 'AI 短影音', 'AI 自動化', 'prompt', 'AutoVideo'],
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: SITE.description,
    type: 'website',
    url: SITE_URL,
    siteName: SITE.name,
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
}

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  description: SITE.description,
  url: SITE_URL,
  inLanguage: 'zh-TW',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="bg-white text-gray-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
