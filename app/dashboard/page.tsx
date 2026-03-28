import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { lessons } from '@/lib/course-data'
import CoursePage from './CoursePage'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 檢查登入
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 檢查購買 — service client bypasses RLS
  const serviceClient = createServiceClient()
  const { data: purchase } = await serviceClient
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .maybeSingle()

  if (!purchase) redirect('/#pricing')

  // 產生所有影片的 signed URL（2 小時有效）
  const { data: signedList } = await serviceClient.storage
    .from('videos')
    .createSignedUrls(
      lessons.map(l => `${l.id}.mp4`),
      60 * 60 * 2,
    )

  const videoUrls: Record<string, string> = {}
  for (const item of signedList ?? []) {
    if (!item.path) continue
    const id = item.path.replace('.mp4', '')
    videoUrls[id] = item.signedUrl
  }

  return (
    <CoursePage
      userEmail={user.email ?? ''}
      videoUrls={videoUrls}
    />
  )
}
