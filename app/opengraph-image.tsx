import { ImageResponse } from 'next/og'
import { SITE } from '@/lib/site'

// Next.js convention: this file becomes /opengraph-image.
export const runtime = 'edge'
export const alt = `${SITE.name} — ${SITE.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'radial-gradient(60% 50% at 20% 110%, rgba(240,166,90,.35), transparent 70%), linear-gradient(160deg, #111826, #05070b)', color: '#ece7dd', padding: '72px 80px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 700, color: '#f0a65a', letterSpacing: '0.2em' }}>
          <span style={{ width: 14, height: 14, borderRadius: 999, background: '#ff4d3d' }} />
          {SITE.name}
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', maxWidth: 1000 }}>{SITE.tagline}</div>
        <div style={{ display: 'flex', fontSize: 28, color: '#9aa3ad' }}>影片筆記 · 免費 prompt 包 · 一鍵跑起來的 AI 工作流</div>
      </div>
    ),
    size,
  )
}
