import Link from 'next/link'
import { CHANNELS, PLATFORM_LABELS, SITE, type PlatformKey } from '@/lib/site'

export default function Footer() {
  const channelLinks = CHANNELS.flatMap(channel =>
    (Object.entries(channel.links) as [PlatformKey, string][]).map(([platform, url]) => ({ key: `${channel.key}-${platform}`, label: PLATFORM_LABELS[platform], url })),
  )
  return (
    <footer className="bg-ink py-12 text-[#c0d0cd]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <p className="text-base font-bold text-white">{SITE.name}</p>
            <p className="mt-3 text-xs leading-6">{SITE.tagline}。</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
            <div>
              <p className="mb-3 font-semibold uppercase tracking-wider text-white">內容</p>
              <ul className="space-y-2">
                <li><Link href="/videos" className="hover:text-white">影片筆記</Link></li>
                <li><Link href="/free" className="hover:text-white">免費資源</Link></li>
                <li><Link href="/#coming" className="hover:text-white">工作流與課程</Link></li>
              </ul>
            </div>
            {channelLinks.length > 0 && (
              <div>
                <p className="mb-3 font-semibold uppercase tracking-wider text-white">頻道</p>
                <ul className="space-y-2">
                  {channelLinks.map(link => (
                    <li key={link.key}><a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-white">{link.label}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="mb-3 font-semibold uppercase tracking-wider text-white">說明</p>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white">隱私權政策</Link></li>
                <li><Link href="/terms" className="hover:text-white">使用條款</Link></li>
                <li><Link href="/refund" className="hover:text-white">退費政策</Link></li>
                <li><a href={`mailto:${SITE.contactEmail}`} className="hover:text-white">聯絡我們</a></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-[#8fa3a0]">© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  )
}
