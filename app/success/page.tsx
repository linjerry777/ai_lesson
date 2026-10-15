import { CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { PLATFORM_APP_ID } from '@/lib/platform'
import { getCourse } from '@/lib/courses'
import { purchaseMatchesMode } from '@/lib/learner-access'
import { stripeIsLive } from '@/lib/stripe'

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams
  const validId = sessionId && /^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(sessionId) ? sessionId : null
  const currentPath = validId ? `/success?session_id=${encodeURIComponent(validId)}` : '/success'
  const { data: { user } } = await (await createClient()).auth.getUser()
  if (!user) redirect(`/login?next=${encodeURIComponent(currentPath)}`)
  let productId: string | null = null
  if (validId && purchaseMatchesMode(validId, stripeIsLive())) {
    const { data, error } = await createServiceClient().from('purchases').select('product_id')
      .eq('app_id', PLATFORM_APP_ID).eq('user_id', user.id).eq('stripe_session_id', validId).eq('status', 'completed').maybeSingle()
    if (!error && getCourse(data?.product_id) && !getCourse(data?.product_id)?.isFree) productId = data!.product_id
  }
  const Icon = productId ? CheckCircle : Clock
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Icon size={40} className="mx-auto mb-6 text-brand-500" />
        <h1 className="text-2xl font-black text-gray-900 mb-3">{productId ? '課程權限已確認' : '尚未確認課程權限'}</h1>
        <p className="text-gray-600 mb-8">{productId ? `${getCourse(productId)!.title} 的購買紀錄已寫入，可以開始閱讀。` : '目前帳號還沒有這筆已完成的購買紀錄。若剛完成付款，請稍後重新確認；返回網址本身不會解鎖課程。'}</p>
        <Link href={productId ? `/dashboard?course=${productId}` : currentPath} className="inline-flex min-h-11 items-center bg-brand-500 text-white font-bold px-6 py-3 rounded-xl text-sm">{productId ? '開始學習' : '重新確認'}</Link>
        <p className="text-sm text-gray-500 mt-5"><Link href="/dashboard">查看我的課程</Link></p>
      </div>
    </div>
  )
}
