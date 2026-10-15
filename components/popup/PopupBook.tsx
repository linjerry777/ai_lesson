'use client'

import { useState } from 'react'
import Link from 'next/link'
import LeadForm from '@/components/cinema/LeadForm'
import PopupChapter from './PopupChapter'
import styles from './popup.module.css'

interface Props {
  resource: { slug: string; title: string; format: string } | null
  product: { name: string; tagline: string; price: string }
}

const TOTAL = 3
const L = (name: string) => `/popup/${name}.webp`

export default function PopupBook({ resource, product }: Props) {
  const [sent, setSent] = useState(false)

  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <Link href="/book" className={`${styles.serif} ${styles.brand}`}>Jerry 的 AI 頻道</Link>
        <nav className={styles.nav} aria-label="主要導覽">
          <Link href="/videos">頻道</Link>
          <a href="#free">免費教學</a>
          <a href="#shop">課程</a>
          <a href="mailto:donutai08@gmail.com?subject=%E5%A7%94%E8%A8%97%E8%A3%BD%E4%BD%9C">接案</a>
        </nav>
      </header>

      <main>
        <PopupChapter
          id="cover"
          index={1}
          total={TOTAL}
          accent="#c98a2e"
          cover="#2f3a4f"
          startOpen
          hint="往下滑，翻開"
          layers={[
            { src: L('cover_back'), x: 0.56, depth: 0.92, width: 0.82 },
            { src: L('cover_desk'), x: 0.42, depth: 0.55, width: 0.44 },
            { src: L('cover_xun'), x: 0.66, depth: 0.42, width: 0.17, standee: true },
            { src: L('cover_robot'), x: 0.8, depth: 0.3, width: 0.11, standee: true },
            { src: L('cover_front'), x: 0.3, depth: 0.08, width: 0.4 },
          ]}
          copy={
            <>
              <p className={styles.kicker}>Chapter 01</p>
              <h1 id="cover-title" className={`${styles.serif} ${styles.title}`}>Jerry 的<br />AI 頻道</h1>
              <p className={styles.lede}>看影片・學工作流・拿免費資源</p>
              <div className={styles.actions}>
                <a href="#free" className={styles.button}>翻開 →</a>
                <Link href="/videos" className={styles.link}>直接看影片筆記</Link>
              </div>
            </>
          }
        />

        <PopupChapter
          id="free"
          index={2}
          total={TOTAL}
          accent="#5f8f7b"
          cover="#7d9c8c"
          className={sent ? styles.sent : undefined}
          layers={[
            { src: L('free_back'), x: 0.5, depth: 0.92, width: 0.86 },
            { src: L('free_mailbox'), x: 0.3, depth: 0.6, width: 0.17 },
            { src: L('free_mochi'), x: 0.5, depth: 0.45, width: 0.17, standee: true },
            { src: L('free_envelope'), x: 0.24, depth: 0.22, width: 0.26, className: styles.envelopeCard },
            { src: L('free_front'), x: 0.68, depth: 0.06, width: 0.42 },
          ]}
          copy={
            <>
              <p className={styles.kicker}>Chapter 02 · Free</p>
              <h2 id="free-title" className={`${styles.serif} ${styles.title}`}>免費教學</h2>
              <p className={styles.lede}>{resource ? `留下 Email，「${resource.title}」馬上寄到你手上。` : '免費資源整理中，很快上架。'}</p>
              {resource && (
                <div className="mt-7 max-w-md">
                  <LeadForm resource={resource.slug} title={resource.title} variant="paper" submitLabel="寄給我" compact onSuccess={() => setSent(true)} />
                </div>
              )}
            </>
          }
        />

        <PopupChapter
          id="shop"
          index={3}
          total={TOTAL}
          accent="#c98a2e"
          cover="#b8862f"
          layers={[
            { src: L('shop_back'), x: 0.52, depth: 0.92, width: 0.86 },
            { src: L('shop_box2'), x: 0.68, depth: 0.62, width: 0.16 },
            {
              src: L('shop_box'), x: 0.47, depth: 0.5, width: 0.24,
              children: <span className={`${styles.serif} ${styles.tag}`}>{product.price}</span>,
            },
            { src: L('shop_xun'), x: 0.22, depth: 0.38, width: 0.16, standee: true },
            { src: L('cover_robot'), x: 0.33, depth: 0.22, width: 0.09, standee: true },
            { src: L('shop_front'), x: 0.7, depth: 0.05, width: 0.42 },
          ]}
          copy={
            <>
              <p className={styles.kicker}>Chapter 03 · Shop</p>
              <h2 id="shop-title" className={`${styles.serif} ${styles.title}`}>{product.name}</h2>
              <p className={styles.lede}>{product.tagline}</p>
              <div className={styles.actions}>
                <span className={styles.button} aria-disabled="true">即將開放 · {product.price}</span>
                <a href="#free" className={styles.link}>先拿免費試用品 →</a>
              </div>
              <p className={styles.note}>上架時會寄信通知留過 Email 的人。</p>
            </>
          }
        />
      </main>

      <footer className={styles.endnote}>
        <p className={styles.serif}>— 未完待續 —</p>
        <nav aria-label="頁尾">
          <Link href="/videos">影片筆記</Link>
          <Link href="/free">免費資源</Link>
          <Link href="/privacy">隱私權政策</Link>
          <Link href="/terms">使用條款</Link>
        </nav>
      </footer>
    </div>
  )
}
