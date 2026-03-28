import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import CheckoutForm from './CheckoutForm'

export const metadata = { title: '購課付款 | 網課小韭菜' }

export default async function CheckoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/checkout')

  // Already purchased → go straight to dashboard
  const { data: purchase } = await createServiceClient()
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .maybeSingle()

  if (purchase) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <CheckoutForm
        userEmail={user.email ?? ''}
        userName={user.user_metadata?.full_name ?? ''}
      />
    </div>
  )
}
