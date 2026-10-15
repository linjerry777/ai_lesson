import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getPublishedVideos } from '@/lib/content'
import { isAdminEmail } from '@/lib/admin'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: '影片成效', robots: { index: false, follow: false } }

interface Row { video_code: string; clicks: number; leads: number }

export default async function StatsPage() {
  const { data: { user } } = await (await createClient()).auth.getUser()
  if (!user) redirect('/login?next=%2Fadmin%2Fstats')
  if (!isAdminEmail(user.email, !!user.email_confirmed_at)) notFound()

  const db = createServiceClient()
  const [{ data: stats, error }, { count: totalLeads }] = await Promise.all([
    db.rpc('ai_lesson_video_stats'),
    db.from('ai_lesson_leads').select('id', { count: 'exact', head: true }).eq('app_id', 'ai-lesson'),
  ])
  const titles = new Map(getPublishedVideos().map(video => [video.code, video.title]))
  const rows = (stats ?? []) as Row[]

  return (
    <main className="min-h-screen bg-paper px-4 py-12 text-ink sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">影片成效（近 90 天）</h1>
        <p className="mt-2 text-sm text-ink-muted">點擊＝/v 短碼的非爬蟲點擊；名單＝來源歸因到該影片的 Email（同一人同一資源只算一次）。全部名單：{totalLeads ?? '—'}</p>
        {error ? <p className="mt-6 text-sm text-[#a5361b]">讀取失敗，請稍後再試。</p> : (
          <div className="mt-6 overflow-x-auto rounded-lg border border-[#e0dfd4] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#fffefa] text-xs text-ink-muted"><tr><th className="p-3">短碼</th><th className="p-3">影片</th><th className="p-3 text-right">點擊</th><th className="p-3 text-right">名單</th><th className="p-3 text-right">轉換率</th></tr></thead>
              <tbody className="divide-y divide-[#e0dfd4]">
                {rows.length ? rows.map(row => (
                  <tr key={row.video_code}>
                    <td className="p-3 font-mono">/v/{row.video_code}</td>
                    <td className="p-3">{titles.get(row.video_code) ?? '（已下架）'}</td>
                    <td className="p-3 text-right">{row.clicks}</td>
                    <td className="p-3 text-right">{row.leads}</td>
                    <td className="p-3 text-right">{row.clicks ? `${Math.round((row.leads / row.clicks) * 100)}%` : '—'}</td>
                  </tr>
                )) : <tr><td colSpan={5} className="p-6 text-center text-ink-muted">還沒有資料</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
