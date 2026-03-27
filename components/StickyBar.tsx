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
              <p className="font-semibold text-gray-900 text-sm">Claude Code 實戰工作流</p>
              <p className="text-xs text-gray-500">40+ 單元 · 6+ 小時 · 永久觀看</p>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <div className="text-right">
                <span className="text-xs text-gray-400 line-through block">NT$5,000</span>
                <span className="text-lg font-bold text-brand-500">NT$2,640</span>
              </div>
              <a
                href="#pricing"
                className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors whitespace-nowrap"
              >
                立即購課
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
