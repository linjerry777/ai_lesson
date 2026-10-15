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
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#f6f3eb', color: '#1c343b', padding: '72px 80px', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 700, color: '#b65025' }}>
          <span style={{ width: 14, height: 14, borderRadius: 999, background: '#b65025' }} />
          {SITE.name}
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', maxWidth: 1000 }}>{SITE.tagline}</div>
        <div style={{ display: 'flex', fontSize: 28, color: '#68706c' }}>影片筆記 · 免費 prompt 包 · 一鍵跑起來的 AI 工作流</div>
      </div>
    ),
    size,
  )
}
