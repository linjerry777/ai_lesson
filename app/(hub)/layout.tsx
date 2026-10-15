import { JetBrains_Mono, Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import CinemaNav from '@/components/cinema/CinemaNav'
import Credits from '@/components/cinema/Credits'
import RainBackdrop from '@/components/cinema/RainBackdrop'
import styles from '@/components/cinema/cinema.module.css'

const serif = Noto_Serif_TC({ weight: ['600', '900'], variable: '--font-serif-tc', display: 'swap', preload: false })
const sans = Noto_Sans_TC({ weight: ['400', '500', '700'], variable: '--font-sans-tc', display: 'swap', preload: false })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' })

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${styles.stage} ${serif.variable} ${sans.variable} ${mono.variable}`} style={{ fontFamily: 'var(--font-sans-tc), var(--font-inter), system-ui, sans-serif' }}>
      <RainBackdrop />
      <CinemaNav />
      {children}
      <Credits />
    </div>
  )
}
