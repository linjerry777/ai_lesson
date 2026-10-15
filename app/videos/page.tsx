import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/sections/Footer'
import VideoCard from '@/components/hub/VideoCard'
import { getPublishedVideos } from '@/lib/content'
import { CHANNELS, SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `影片筆記 | ${SITE.name}`,
  description: '每支影片的重點整理、可直接複製的 prompt 與工具清單。',
  alternates: { canonical: '/videos' },
}

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ channel?: string }> }) {
  const { channel } = await searchParams
  const active = CHANNELS.some(item => item.key === channel) ? channel : undefined
  const videos = getPublishedVideos().filter(video => !active || video.channel === active)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-paper px-4 pb-20 pt-28 text-ink sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-rust">全部影片</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">影片筆記</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink-muted">看完影片想照著做？每篇筆記都有重點、prompt 和用到的工具。</p>
          {CHANNELS.length > 1 && (
            <nav className="mt-6 flex flex-wrap gap-2" aria-label="依頻道篩選">
              <Link href="/videos" className={`rounded-full border px-4 py-2 text-xs font-semibold ${!active ? 'border-ink bg-ink text-white' : 'border-[#d9dbd0] bg-white'}`}>全部</Link>
              {CHANNELS.map(item => (
                <Link key={item.key} href={`/videos?channel=${item.key}`} className={`rounded-full border px-4 py-2 text-xs font-semibold ${active === item.key ? 'border-ink bg-ink text-white' : 'border-[#d9dbd0] bg-white'}`}>{item.name}</Link>
              ))}
            </nav>
          )}
          {videos.length ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map(video => <VideoCard key={video.slug} video={video} />)}
            </div>
          ) : (
            <p className="mt-10 text-sm text-ink-muted">這個頻道還沒有影片筆記。</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
