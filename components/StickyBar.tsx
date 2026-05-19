'use client'

import { useState, useEffect } from 'react'

export default function StickyBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero section (~600px)
      setVisible(window.scrollY > 600)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="font-semibold text-gray-900 text-sm">先從免費預備課開始</p>
              <p className="text-xs text-gray-500">補終端機、Git、env 與 AI 求救格式，再進付費實戰課</p>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <div className="hidden text-right sm:block">
                <span className="text-xs text-gray-400 line-through block">NT$2,640</span>
                <span className="text-lg font-bold text-brand-500">NT$990</span>
              </div>
              <a
                href="/login?next=%2Fdashboard%3Fcourse%3Dstarter-free"
                className="border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-200 hover:text-brand-600 rounded-lg whitespace-nowrap"
              >
                免費入門
              </a>
              <a
                href="#pricing"
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                看方案
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
