import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CoursePage from './CoursePage'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 檢查登入
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 檢查購買
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id, created_at')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .single()

  if (!purchase) redirect('/#pricing')

  return (
    <CoursePage
      userEmail={user.email ?? ''}
      purchasedAt={purchase.created_at}
    />
  )
}
