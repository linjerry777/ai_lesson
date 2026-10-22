import type { Metadata } from 'next'
import Link from 'next/link'
import VideoCard from '@/components/site/VideoCard'
import { Kicker, Lede, PageTitle } from '@/components/site/ui'
import { getPublishedVideos } from '@/lib/content'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: `影片筆記 | ${SITE.name}`,
  description: '每支影片的重點整理、可直接複製的 prompt 與工具清單。',
  alternates: { canonical: '/videos' },
}

export default function VideosPage() {
  const videos = getPublishedVideos()
  return (
    <main className="px-4 pb-28 pt-16 sm:px-8 sm:pt-24">
      <div className="mx-auto max-w-[1200px]">
        <Kicker color="#f5a524">NOTES / ALL EPISODES</Kicker>
        <PageTitle>影片筆記</PageTitle>
        <Lede>看完影片想照著做？每一支都整理好重點、可直接複製的 prompt 和用到的工具。</Lede>
        {videos.length ? (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map(video => <VideoCard key={video.slug} video={video} />)}
          </div>
        ) : (
          <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stickers/xun-explain.webp" alt="小訊" className="sticker-img h-[140px] w-auto shrink-0" />
            <div className="relative mb-4 max-w-xl border-2 border-[var(--ink)] bg-white px-5 py-4 text-[15px] leading-7 shadow-[4px_4px_0_var(--ink)]">
              <b>小訊：</b>第一支教學影片正在做，上線後每一支都會在這裡附上重點、可以直接複製的指令和用到的工具。等不及的話，先看看這些：
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-black">
                <Link href="/free" className="border-2 border-[var(--ink)] px-3 py-1.5">免費 Prompt 包 →</Link>
                <Link href="/shop" className="border-2 border-[var(--ink)] bg-[var(--ink)] px-3 py-1.5 text-white">看實測過的指令包 →</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
