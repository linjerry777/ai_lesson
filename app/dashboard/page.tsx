import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import CoursePage from './CoursePage'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 檢查登入
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 檢查購買 — use service client to bypass RLS on purchases table
  const serviceClient = createServiceClient()
  const { data: purchase } = await serviceClient
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .maybeSingle()

  if (!purchase) redirect('/#pricing')

  return (
    <CoursePage
      userEmail={user.email ?? ''}
    />
  )
}
