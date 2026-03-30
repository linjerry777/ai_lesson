import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from './LoginForm'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  // Already logged in → send to activate (which redirects to dashboard if already purchased)
  if (session) {
    redirect('/activate')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">AI</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">登入 / 註冊</h1>
          <p className="text-gray-500 text-sm mt-1">
            購課前請先登入或建立帳號
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-gray-400 mt-6">
          登入即代表你同意我們的{' '}
          <a href="/terms" className="underline">使用條款</a>
          {' '}及{' '}
          <a href="/privacy" className="underline">隱私權政策</a>
        </p>
      </div>
    </div>
  )
}
