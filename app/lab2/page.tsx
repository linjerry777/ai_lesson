import type { Metadata } from 'next'
import { JetBrains_Mono, Noto_Sans_TC, Space_Grotesk } from 'next/font/google'
import Lab2Loader from '@/components/lab2/Lab2Loader'

const sans = Noto_Sans_TC({ weight: ['400', '500', '700'], variable: '--font-sans-tc', display: 'swap', preload: false })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-mono', display: 'swap' })
const display = Space_Grotesk({ subsets: ['latin'], weight: ['700'], variable: '--font-display', display: 'swap' })

export const metadata: Metadata = { title: 'JERRY.AI — solid test', robots: { index: false, follow: false } }

export default function Lab2Page() {
  return (
    <div className={`${sans.variable} ${mono.variable} ${display.variable}`}>
      <Lab2Loader />
    </div>
  )
}
