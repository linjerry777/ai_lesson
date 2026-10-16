import { Anton, Instrument_Serif, JetBrains_Mono, Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import Masthead from '@/components/site/Masthead'
import SiteFooter from '@/components/site/SiteFooter'

const tc = Noto_Sans_TC({ weight: ['400', '500', '700', '900'], variable: '--font-tc', display: 'swap', preload: false })
const serifTc = Noto_Serif_TC({ weight: ['300', '400'], variable: '--font-serif-tc', display: 'swap', preload: false })
const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-serif', display: 'swap' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-mono', display: 'swap' })

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${tc.variable} ${serifTc.variable} ${display.variable} ${serif.variable} ${mono.variable} hub`}>
      <Masthead />
      {children}
      <SiteFooter />
    </div>
  )
}
