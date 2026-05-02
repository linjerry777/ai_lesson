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

  // 純文字課程 — 不再從 Supabase Storage 讀影片簽名 URL。
  // 之後想加 video bonus 再從 course.lessons 為基礎重新拉。

  return (
    <CoursePage
      userEmail={user.email ?? ''}
      courseTitle={course.title}
      lessons={course.lessons}
      tier={(purchase as { tier?: 'self' | 'cohort' }).tier ?? 'self'}
    />
  )
}
