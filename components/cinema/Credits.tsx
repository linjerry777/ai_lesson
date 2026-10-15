import Link from 'next/link'
import { CHANNELS, PLATFORM_LABELS, SITE, type PlatformKey } from '@/lib/site'
import styles from './cinema.module.css'

function Role({ role, children }: { role: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-baseline gap-4">
      <span className={`${styles.mono} text-right text-[10px] text-[#7d858f]`}>{role}</span>
      <span className="h-px w-6 bg-white/15" />
      <span className="text-sm text-[#d9d5cc]">{children}</span>
    </div>
  )
}

/** End credits instead of a footer. */
export default function Credits() {
  const channelLinks = CHANNELS.flatMap(channel =>
    (Object.entries(channel.links) as [PlatformKey, string][]).map(([platform, url]) => ({ key: `${channel.key}-${platform}`, label: PLATFORM_LABELS[platform], url })),
  )
  return (
    <footer className="relative border-t border-white/10 bg-black/60 px-4 pb-14 pt-20 backdrop-blur-sm">
      <div className="mx-auto max-w-xl text-center">
        <p className={`${styles.mono} text-[10px] text-[#7d858f]`}>End Credits</p>
        <p className={`${styles.display} mt-4 text-3xl text-[#ece7dd]`}>{SITE.name}</p>
        <p className="mt-3 text-sm text-[#9aa3ad]">{SITE.tagline}。</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-xl gap-3">
        <Role role="導演 · 剪輯">Jerry Lin</Role>
        <Role role="主要工具">Claude Code · ffmpeg · Next.js</Role>
        <Role role="片單"><Link href="/videos" className="underline-offset-4 hover:underline">影片筆記</Link></Role>
        <Role role="附錄"><Link href="/free" className="underline-offset-4 hover:underline">免費資源</Link></Role>
        {channelLinks.length > 0 && (
          <Role role="放映廳">
            {channelLinks.map((link, index) => (
              <span key={link.key}>{index > 0 && ' · '}<a href={link.url} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{link.label}</a></span>
            ))}
          </Role>
        )}
        <Role role="聯絡"><a href={`mailto:${SITE.contactEmail}`} className="underline-offset-4 hover:underline">{SITE.contactEmail}</a></Role>
      </div>
      <div className="mx-auto mt-14 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-[#7d858f]">
        <Link href="/privacy" className="hover:text-white">隱私權政策</Link>
        <Link href="/terms" className="hover:text-white">使用條款</Link>
        <Link href="/refund" className="hover:text-white">退費政策</Link>
      </div>
      <p className={`${styles.mono} mt-8 text-center text-[10px] text-[#5d646d]`}>© {new Date().getFullYear()} {SITE.name} · Shot on rainy nights in Taiwan</p>
    </footer>
  )
}
