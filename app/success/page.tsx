import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-500" />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-3">
          購課成功！🎉
        </h1>
        <p className="text-gray-600 mb-2">
          感謝你的購買！課程已成功啟用。
        </p>
        <p className="text-sm text-gray-500 mb-8">
          你現在可以開始學習所有課程內容，祝學習愉快！
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
        >
          開始學習 →
        </Link>

        <p className="text-xs text-gray-400 mt-4">
          有任何問題請聯繫{' '}
          <a href="mailto:donutai08@gmail.com" className="underline">
            donutai08@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}
