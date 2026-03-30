'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ActivateForm({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const [key, setKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleActivate() {
    if (!key.trim()) return
    setLoading(true)
    setError('')

    const res = await fetch('/api/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey: key.trim() }),
    })

    const data = await res.json()

    if (res.ok) {
      router.push('/dashboard')
    } else {
      setError(data.error ?? '啟用失敗，請再試一次')
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
      <div className="mb-4">
        <p className="text-gray-500 text-xs mb-1">登入帳號</p>
        <p className="text-gray-300 text-sm font-medium">{userEmail}</p>
      </div>

      <div className="mb-4">
        <label className="block text-gray-400 text-sm mb-2">License Key</label>
        <input
          type="text"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="XXXXXXXX-XXXXXXXX-XXXXXXXX-XXXXXXXX"
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm font-mono placeholder-gray-600 focus:outline-none focus:border-brand-500 transition-colors"
          onKeyDown={e => e.key === 'Enter' && handleActivate()}
        />
      </div>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleActivate}
        disabled={loading || !key.trim()}
        className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl text-sm transition-colors"
      >
        {loading ? '驗證中...' : '啟用課程'}
      </button>
    </div>
  )
}
