'use client'

import { useEffect, useState, useCallback } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { Shield, Lock, CheckCircle } from 'lucide-react'

/* ---------- TapPay global types ---------- */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TPDirect: any
  }
}

interface Props {
  userEmail: string
  userName: string
}

export default function CheckoutForm({ userEmail, userName }: Props) {
  const router = useRouter()
  const [sdkReady, setSdkReady] = useState(false)
  const [canPay, setCanPay] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /* ── init TapPay once SDK script loads ── */
  const initTapPay = useCallback(() => {
    const appId = Number(process.env.NEXT_PUBLIC_TAPPAY_APP_ID)
    const appKey = process.env.NEXT_PUBLIC_TAPPAY_APP_KEY ?? ''
    const env = process.env.NEXT_PUBLIC_TAPPAY_ENV === 'production' ? 'production' : 'sandbox'
    window.TPDirect.setupSDK(appId, appKey, env)

    window.TPDirect.card.setup({
      fields: {
        number: { element: '#tp-card-number', placeholder: '**** **** **** ****' },
        expirationDate: { element: '#tp-card-exp', placeholder: 'MM / YY' },
        ccv: { element: '#tp-card-ccv', placeholder: 'CVV' },
      },
      styles: {
        input: { color: '#111827', 'font-size': '15px', 'font-family': 'inherit' },
        ':focus': { color: '#111827' },
        '.valid': { color: '#059669' },
        '.invalid': { color: '#dc2626' },
        'input::placeholder': { color: '#9ca3af' },
      },
      isMaskCreditCardNumber: true,
      maskCreditCardNumberRange: { beginIndex: 6, endIndex: 11 },
    })

    window.TPDirect.card.onUpdate((update: { canGetPrime: boolean }) => {
      setCanPay(update.canGetPrime)
    })

    setSdkReady(true)
  }, [])

  /* ── keep body non-scrollable while modal-style page ── */
  useEffect(() => {
    document.body.style.overflow = 'auto'
  }, [])

  const handlePay = () => {
    if (!canPay || loading || !sdkReady) return
    setLoading(true)
    setError('')

    window.TPDirect.card.getPrime(async (result: { status: number; msg?: string; card: { prime: string } }) => {
      if (result.status !== 0) {
        setError(`getPrime 失敗 status=${result.status} msg=${result.msg ?? ''}`)
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prime: result.card.prime, email: userEmail }),
        })
        const data = await res.json()

        if (!res.ok || data.error) {
          setError(data.error || '付款失敗，請稍後再試')
          setLoading(false)
          return
        }

        router.push('/success')
      } catch {
        setError('網路錯誤，請重新整理後再試')
        setLoading(false)
      }
    })
  }

  return (
    <>
      <Script
        src="https://js.tappaysdk.com/sdk/tpdirect/v5.19.2"
        strategy="afterInteractive"
        onLoad={initTapPay}
      />

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-md mx-auto">
        {/* Header */}
        <div className="bg-brand-500 px-8 py-6 text-white">
          <p className="text-sm font-medium opacity-80 mb-1">網課小韭菜</p>
          <h1 className="text-xl font-black">AI 工具課程</h1>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-black">NT$2,640</span>
            <span className="text-sm opacity-70 line-through">NT$5,000</span>
          </div>
          <p className="text-xs opacity-70 mt-1">一次買斷 · 7 章完整課程 · 永久觀看</p>
        </div>

        <div className="px-8 py-7 space-y-5">
          {/* Order summary */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm space-y-1">
            <p className="font-semibold text-gray-800">購課人：{userName || userEmail}</p>
            <p className="text-gray-500">Email：{userEmail}</p>
          </div>

          {/* Card fields */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">信用卡資訊</label>

            {/* Card number */}
            <div className="border border-gray-200 rounded-xl px-4 py-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
              <p className="text-xs text-gray-400 mb-1">卡號</p>
              <div id="tp-card-number" className="h-6" />
            </div>

            {/* Exp + CVV */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-xl px-4 py-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                <p className="text-xs text-gray-400 mb-1">有效期限</p>
                <div id="tp-card-exp" className="h-6" />
              </div>
              <div className="border border-gray-200 rounded-xl px-4 py-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
                <p className="text-xs text-gray-400 mb-1">CVV</p>
                <div id="tp-card-ccv" className="h-6" />
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Pay button */}
          <button
            onClick={handlePay}
            disabled={!canPay || loading || !sdkReady}
            className="w-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-base transition-colors shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                付款處理中…
              </>
            ) : (
              <>
                <Lock size={16} />
                確認付款 NT$2,640
              </>
            )}
          </button>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-5 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Shield size={13} />
              TapPay 加密保護
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCircle size={13} />
              7 天未看全退
            </div>
          </div>

          <p className="text-center text-xs text-gray-400">
            付款有問題請聯繫{' '}
            <a href="mailto:donutai08@gmail.com" className="underline hover:text-brand-500">
              donutai08@gmail.com
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
