import type { Metadata } from 'next'
import Link from 'next/link'
import VideoCard from '@/components/cinema/VideoCard'
import styles from '@/components/cinema/cinema.module.css'
import { getPublishedVideos } from '@/lib/content'
import { CHANNELS, SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `片單 · 影片筆記 | ${SITE.name}`,
  description: '每支影片的重點整理、可直接複製的 prompt 與工具清單。',
  alternates: { canonical: '/videos' },
}

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ channel?: string }> }) {
  const { channel } = await searchParams
  const active = CHANNELS.some(item => item.key === channel) ? channel : undefined
  const videos = getPublishedVideos().filter(video => !active || video.channel === active)
  const chip = (on: boolean) => `${styles.mono} rounded-full border px-4 py-2 text-[10px] transition ${on ? 'border-[#f0a65a] text-[#f0a65a]' : 'border-white/15 text-[#9aa3ad] hover:border-white/40'}`

  return (
    <main className="px-4 pb-28 pt-32 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className={`${styles.mono} text-[10px] text-[#f0a65a]`}>Now Showing · 全部影片</p>
        <h1 className={`${styles.display} mt-4 text-[clamp(36px,6vw,64px)] leading-tight text-[#ece7dd]`}>片單</h1>
        <p className={`${styles.subtitle} mt-5 max-w-xl text-base leading-8`}>—— 看完想照著做？每部都附重點、prompt 和用到的工具。</p>
        {CHANNELS.length > 1 && (
          <nav className="mt-8 flex flex-wrap gap-2" aria-label="依頻道篩選">
            <Link href="/videos" className={chip(!active)}>全部</Link>
            {CHANNELS.map(item => <Link key={item.key} href={`/videos?channel=${item.key}`} className={chip(active === item.key)}>{item.name}</Link>)}
          </nav>
        )}
        {videos.length ? (
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map(video => <VideoCard key={video.slug} video={video} />)}
          </div>
        ) : (
          <p className="mt-14 text-sm text-[#9aa3ad]">這個頻道還沒有影片筆記。</p>
        )}
      </div>
    </main>
  )
}
