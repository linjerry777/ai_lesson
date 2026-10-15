import type { Metadata } from 'next'
import { JetBrains_Mono, Noto_Sans_TC, Space_Grotesk } from 'next/font/google'
import LabLoader from '@/components/lab/LabLoader'
import { getPublishedResources } from '@/lib/content'

const sans = Noto_Sans_TC({ weight: ['400', '500', '700'], variable: '--font-sans-tc', display: 'swap', preload: false })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-mono', display: 'swap' })
const display = Space_Grotesk({ subsets: ['latin'], weight: ['700'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = {
  title: 'JERRY.AI',
  description: '一個人，七個頻道，每天自動開播。Jerry 的 AI 工作流片場。',
  robots: { index: false, follow: false },
}

export default function LabPage() {
  const first = getPublishedResources()[0]
  return (
    <div className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <LabLoader resource={first ? { slug: first.slug, title: first.title } : null} />
    </div>
  )
}
