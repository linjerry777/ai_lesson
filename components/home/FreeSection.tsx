import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import LeadForm from '@/components/site/LeadForm'
import { Card, Kicker } from '@/components/site/ui'

export interface NoteRow { slug: string; code: string; title: string; publishedAt: string }
export interface ResourceRef { slug: string; title: string; summary: string; format: string }

export default function FreeSection({ notes, resource }: { notes: NoteRow[]; resource: ResourceRef | null }) {
  return (
    <section id="free" className="relative scroll-mt-16 px-4 py-16 sm:px-8 lg:py-20" aria-labelledby="free-title">
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] lg:items-start">
        <div>
          <Kicker color="#ff5d8f">02 — FREE / 免費教學</Kicker>
          <h2 id="free-title" className="mt-3 text-[clamp(30px,4.2vw,64px)] font-black leading-[1.04] tracking-[-.04em]">
            看完影片，<br /><span className="bg-[#ff5d8f] px-2 text-white [box-decoration-break:clone]">照著做</span>就會。
          </h2>
          <div className="mt-6 flex items-end gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stickers/xun.webp" alt="小訊" loading="lazy" className="sticker-img h-[110px] w-auto shrink-0 -rotate-3 sm:h-[130px]" />
            <div className="relative mb-5 max-w-lg border-2 border-[var(--ink)] bg-white px-4 py-3 text-[14px] leading-6 shadow-[4px_4px_0_var(--ink)]">
              <span className="absolute -left-[9px] bottom-4 h-4 w-4 rotate-45 border-b-2 border-l-2 border-[var(--ink)] bg-white" aria-hidden="true" />
              <b>小訊：</b>每支影片我都整理成一頁筆記，重點、可以直接複製的 prompt、用到的工具都在裡面。想動手做，先下載右邊的免費資源。
            </div>
          </div>

          <div className="mt-8 border-t-2 border-[var(--ink)]">
            <p className="flex items-center justify-between py-3 font-mono text-[11px] font-bold tracking-[.16em]">
              LATEST NOTES <Link href="/videos" className="inline-flex items-center gap-1 hover:underline">全部影片筆記 <ArrowRight size={13} aria-hidden="true" /></Link>
            </p>
            {notes.length ? (
              <ul>
                {notes.map(note => (
                  <li key={note.slug} className="border-t border-[var(--rule)]">
                    <Link href={`/videos/${note.slug}`} className="group grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-4 py-4">
                      <span className="font-display text-2xl text-[#ff5d8f]">EP{note.code.padStart(2, '0').toUpperCase()}</span>
                      <span>
                        <span className="block text-lg font-bold leading-snug group-hover:underline">{note.title}</span>
                        <span className="font-mono text-[11px] text-[var(--ink-2)]">{note.publishedAt.replaceAll('-', '.')}</span>
                      </span>
                      <ArrowUpRight size={18} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : <p className="border-t border-[var(--rule)] py-5 text-sm text-[var(--ink-2)]">影片筆記整理中。</p>}
          </div>
        </div>

        {resource && (
          <div className="relative mt-10 lg:mt-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/stickers/mochi-love.webp" alt="" loading="lazy" className="sticker-img pointer-events-none absolute bottom-full right-3 z-10 w-24 translate-y-[28%] rotate-[8deg]" />
            <Card className="relative p-6 sm:p-8">
              <p className="pr-24 font-mono text-[11px] font-bold tracking-[.16em] text-[var(--ink-2)]">FREE DOWNLOAD · {resource.format}</p>
              <h3 className="mt-3 pr-20 text-2xl font-black leading-snug sm:text-3xl">{resource.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--ink-2)]">{resource.summary}</p>
              <div className="mt-6"><LeadForm resource={resource.slug} title={resource.title} /></div>
              <Link href={`/free/${resource.slug}`} className="mt-5 inline-flex items-center gap-1 font-mono text-[11px] font-bold tracking-[.1em] hover:underline">看內容有什麼 <ArrowRight size={13} aria-hidden="true" /></Link>
            </Card>
          </div>
        )}
      </div>
    </section>
  )
}
