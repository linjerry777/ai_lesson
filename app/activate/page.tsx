import { redirect } from 'next/navigation'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import ActivateForm from './ActivateForm'

export const metadata = { title: '啟用課程 | 網課小韭菜' }

export default async function ActivatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const serviceClient = createServiceClient()
  const { data: purchase } = await serviceClient
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .maybeSingle()

  if (purchase) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">啟用你的課程</h1>
          <p className="text-gray-400 text-sm">
            輸入購課後 Gumroad 寄給你的 License Key
          </p>
        </div>
        <ActivateForm userEmail={user.email ?? ''} />
        <p className="text-center text-gray-600 text-xs mt-6">
          沒有收到 License Key？請檢查垃圾郵件，或聯繫{' '}
          <a href="mailto:donutai08@gmail.com" className="text-brand-400 hover:underline">
            donutai08@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
