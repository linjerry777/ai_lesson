import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getCourse, DEFAULT_PRODUCT } from '@/lib/courses'
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
    .select('id, product_id, tier')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!purchase) redirect('/#pricing')

  // 找對應的課程內容；migration 跑前的舊 row 沒 product_id → fallback to default
  const course =
    getCourse((purchase as { product_id?: string }).product_id) ??
    getCourse(DEFAULT_PRODUCT)!

  // 產生所有影片的 signed URL（2 小時有效）— bucket 用 product slug 隔離
  const { data: signedList } = await serviceClient.storage
    .from('videos')
    .createSignedUrls(
      course.lessons.map(l => `${course.slug}/${l.id}.mp4`),
      60 * 60 * 2,
    )

  const videoUrls: Record<string, string> = {}
  for (const item of signedList ?? []) {
    if (!item.path) continue
    const id = item.path.replace(`${course.slug}/`, '').replace('.mp4', '')
    videoUrls[id] = item.signedUrl
  }

  // 舊 bucket 結構（扁平，沒 product 子資料夾）的 fallback
  if (Object.keys(videoUrls).length === 0) {
    const { data: legacyList } = await serviceClient.storage
      .from('videos')
      .createSignedUrls(course.lessons.map(l => `${l.id}.mp4`), 60 * 60 * 2)
    for (const item of legacyList ?? []) {
      if (!item.path) continue
      videoUrls[item.path.replace('.mp4', '')] = item.signedUrl
    }
  }

  return (
    <CoursePage
      userEmail={user.email ?? ''}
      videoUrls={videoUrls}
      courseTitle={course.title}
      lessons={course.lessons}
      tier={(purchase as { tier?: 'self' | 'cohort' }).tier ?? 'self'}
    />
  )
}
