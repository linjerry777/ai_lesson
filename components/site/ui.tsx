import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

/** Mono section label: `● FREE / DOWNLOADS`. */
export function Kicker({ children, color = 'var(--red)', className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <p className={`flex items-center gap-2 font-mono text-[11px] font-bold tracking-[.16em] ${className}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
      {children}
    </p>
  )
}

export function PageTitle({ children }: { children: React.ReactNode }) {
  return <h1 className="mt-5 text-balance text-[clamp(40px,7vw,96px)] font-black leading-[1.02] tracking-[-.02em]">{children}</h1>
}

export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 max-w-2xl text-[17px] leading-8 text-[var(--ink-2)]">{children}</p>
}

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex min-h-10 items-center gap-1.5 font-mono text-[11px] font-bold tracking-[.12em] hover:underline">
      <ArrowLeft size={14} aria-hidden="true" />{children}
    </Link>
  )
}

/** White print card: ink border + hard offset shadow. */
export function Card({ as: Tag = 'div', className = '', children }: { as?: 'div' | 'aside' | 'article' | 'section'; className?: string; children: React.ReactNode }) {
  return <Tag className={`border-2 border-[var(--ink)] bg-[var(--white)] shadow-[6px_6px_0_var(--ink)] ${className}`}>{children}</Tag>
}
