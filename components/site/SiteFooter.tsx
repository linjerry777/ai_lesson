import Link from 'next/link'
import { CHANNELS, FAN_WORK, NAV, SITE, slotLabel } from '@/lib/site'

export default function SiteFooter() {
  return (
    <footer className="relative bg-[var(--ink)] px-4 pb-10 pt-16 text-[var(--paper)] sm:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[.16em] text-[#a8a397]">SIGNING OFF</p>
            <p className="mt-4 text-2xl font-black leading-snug">{SITE.manifesto}</p>
            <p className="mt-3 text-sm leading-7 text-[#c9c4b8]">{SITE.tagline}</p>
            <a href={`mailto:${SITE.contactEmail}`} className="mt-6 inline-block font-mono text-xs tracking-[.08em] underline-offset-4 hover:underline">{SITE.contactEmail}</a>
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[.16em] text-[#a8a397]">INDEX</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {NAV.map(item => <li key={item.href}><Link href={item.href} className="hover:underline">{item.label}</Link></li>)}
              <li><Link href="/videos" className="hover:underline">影片筆記</Link></li>
              <li><Link href="/orders" className="hover:underline">找回購買內容</Link></li>
              <li><a href={SITE.studioUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Jerry AI Studio ↗</a></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] font-bold tracking-[.16em] text-[#a8a397]">PROGRAMME</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CHANNELS.map(c => (
                <li key={c.key} className="flex items-center gap-3">
                  <span className="w-16 font-mono text-[11px] tabular-nums text-[#a8a397]">{c.hour !== undefined ? slotLabel(c) : '—'}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: c.color }} aria-hidden="true" />
                  <Link href={`/#ch-${c.key}`} className="hover:underline">{c.name}</Link>
                </li>
              ))}
            </ul>
            <a href={FAN_WORK.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block font-mono text-[11px] tracking-[.06em] text-[#a8a397] hover:text-white hover:underline">
              另有 {FAN_WORK.label} → {FAN_WORK.site} ↗
            </a>
          </div>
        </div>
        <p className="font-display mt-16 select-none text-[clamp(64px,27.5vw,520px)] leading-[.82] tracking-[.01em]" aria-hidden="true">
          JERRY<span className="text-[var(--red)]">.</span>AI
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6 font-mono text-[11px] tracking-[.08em] text-[#c9c4b8]">
          <span>© {new Date().getFullYear()} JERRY.AI · TAIWAN · 24H ON AIR</span>
          <span className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">隱私權</Link>
            <Link href="/terms" className="hover:text-white">條款</Link>
            <Link href="/refund" className="hover:text-white">退費</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
