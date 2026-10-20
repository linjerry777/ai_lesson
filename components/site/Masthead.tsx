'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV, pad2 } from '@/lib/site'
import { useTaipeiClock } from './useTaipeiClock'

export function OnAirClock({ className = '' }: { className?: string }) {
  const now = useTaipeiClock()
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--red)] px-3 py-1 font-mono text-[11px] font-bold tracking-[.12em] text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden="true" />ON AIR
      </span>
      <span className="font-mono text-sm font-bold tabular-nums" aria-label="台北時間">
        {now ? `${pad2(now.h)}:${pad2(now.m)}:${pad2(now.s)}` : '--:--:--'}
      </span>
    </span>
  )
}

export default function Masthead() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ink)] bg-[#f3f0e8]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-6 px-4 sm:px-8">
        <Link href="/" className="font-display text-[28px] leading-none tracking-[.02em]" onClick={() => setOpen(false)}>
          JERRY<span className="text-[var(--red)]">.</span>AI
        </Link>
        <span className="hidden font-mono text-[10px] leading-[1.35] tracking-[.14em] text-[var(--ink-2)] xl:block">
          CLAUDE vs CODEX<br />AI CREATOR STUDIO
        </span>
        <nav aria-label="主要選單" className="ml-auto hidden items-center gap-7 md:flex">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} className="group font-mono text-[12px] font-bold tracking-[.12em]">
              {item.code}
              <span className="ml-1.5 font-[family-name:var(--font-tc)] text-[12px] font-medium tracking-normal text-[var(--ink-2)] group-hover:text-[var(--ink)]">{item.label}</span>
            </Link>
          ))}
        </nav>
        <OnAirClock className="ml-auto hidden border-l border-[var(--rule)] pl-6 md:ml-0 lg:inline-flex" />
        <button
          type="button"
          className="ml-auto inline-flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? '關閉選單' : '開啟選單'}
          onClick={() => setOpen(v => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label="主要選單" className="border-t border-[var(--ink)] bg-[var(--paper)] px-4 pb-6 pt-2 md:hidden">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex min-h-14 items-center justify-between border-b border-[var(--rule)] text-xl font-black">
              {item.label}
              <span className="font-mono text-[11px] font-bold tracking-[.14em] text-[var(--ink-2)]">{item.code}</span>
            </Link>
          ))}
          <OnAirClock className="mt-5" />
        </nav>
      )}
    </header>
  )
}
