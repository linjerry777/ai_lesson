import { ImageResponse } from 'next/og'

// Next.js convention: this file becomes /opengraph-image
// (and is referenced by metadata.openGraph.images automatically).
export const runtime = 'edge'
export const alt = 'Claude Code 實戰工作流 — AI 時代的工程師超能力'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'linear-gradient(135deg, #fff7ed 0%, #ffedd5 35%, #fed7aa 100%)',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#c2410c',
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              padding: '8px 16px',
              background: '#f97316',
              color: '#fff',
              borderRadius: 999,
              fontSize: 18,
            }}
          >
            網課小韭菜
          </span>
          <span style={{ color: '#9a3412' }}>· 一次買斷，永久觀看</span>
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: 56,
            color: '#111827',
            fontWeight: 900,
            fontSize: 88,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          <span>你現在看到的</span>
          <span>
            <span style={{ color: '#f97316' }}>這個網站</span>
          </span>
          <span>是 Claude Code 做的</span>
        </div>

        {/* Sub */}
        <div
          style={{
            display: 'flex',
            marginTop: 36,
            color: '#374151',
            fontSize: 30,
            lineHeight: 1.4,
            maxWidth: 980,
          }}
        >
          Google 登入 + Stripe 付款 + Vercel 部署 — 一個下午整套接起來。
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 56,
            left: 72,
            right: 72,
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#6b7280',
            fontSize: 22,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                display: 'inline-flex',
                width: 36,
                height: 36,
                background: '#f97316',
                color: '#fff',
                fontWeight: 900,
                fontSize: 16,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
              }}
            >
              AI
            </span>
            ailesson-two.vercel.app
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 12,
              color: '#111827',
              fontWeight: 800,
            }}
          >
            <span style={{ fontSize: 44 }}>NT$2,640</span>
            <span style={{ color: '#9ca3af', fontSize: 22, textDecoration: 'line-through' }}>
              NT$5,000
            </span>
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
