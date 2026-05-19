import Link from 'next/link'
import { ArrowLeft, ArrowRight, ExternalLink, Lightbulb, Target } from 'lucide-react'
import CourseAnalyzer from './CourseAnalyzer'
import { courseBuildPrinciples, marketSignals, researchSources } from '@/lib/course-market-data'

export const metadata = {
  title: '2026 課程市場分析 | 網課小韭菜',
  description: '分析 2026 好賣課程趨勢，拆解 AI、資安、資料、內容生產、職涯作品集等課程機會。',
}

export default function MarketPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white">
            <ArrowLeft size={16} />
            回首頁
          </Link>
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-400/40 bg-brand-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-200">
              2026 Course Market
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">
              什麼課程好賣？先看市場訊號，再反推產品設計
            </h1>
            <p className="mt-5 text-base leading-7 text-gray-300">
              我把 2026 的線上學習趨勢整理成可操作的課程雷達。你可以用它分析別人的課程，也可以反推 ai_lesson 下一個課程產品：免費課降門檻、低價課交付結果、高價課搭配回饋與 cohort。
            </p>
          </div>
        </div>
      </section>

      <CourseAnalyzer />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-500">
                <Target size={16} />
                Hot Course Niches
              </p>
              <h2 className="text-3xl font-black text-gray-900">2026 比較值得做的課程方向</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-500">
              判斷標準不是話題熱度，而是：學員願不願意付錢換一個明確結果、是否能展示作品、是否能降低職場風險或增加收入機會。
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {marketSignals.map((signal) => (
              <article key={signal.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                    <signal.icon size={22} />
                  </div>
                  <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-black text-gray-900">{signal.title}</h3>
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
                        {signal.demand}
                      </span>
                    </div>
                    <p className="text-sm leading-6 text-gray-600">{signal.whyItSells}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400">可以怎麼賣</p>
                    <p className="text-sm leading-6 text-gray-700">{signal.courseAngle}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">建立方式</p>
                    <ul className="space-y-2">
                      {signal.buildPath.map((step) => (
                        <li key={step} className="flex gap-2 text-sm leading-6 text-gray-700">
                          <ArrowRight size={15} className="mt-1 shrink-0 text-brand-400" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-800">{signal.risk}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-500">
              <Lightbulb size={16} />
              Build Playbook
            </p>
            <h2 className="text-3xl font-black text-gray-900">建立熱賣課的 5 個規則</h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              這些規則可以直接拿來檢查競品，也可以拿來規劃下一門課。重點是先找到可付費的結果，再回頭設計內容。
            </p>
          </div>
          <div className="grid gap-3">
            {courseBuildPrinciples.map((principle, index) => (
              <div key={principle} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                <span className="font-mono text-sm font-black text-brand-500">{String(index + 1).padStart(2, '0')}</span>
                <p className="text-sm leading-6 text-gray-700">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-black text-gray-900">研究來源</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {researchSources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-gray-200 p-5 transition-colors hover:border-brand-200 hover:bg-brand-50/30"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-brand-500">{source.publisher}</p>
                <h3 className="mt-2 flex items-start gap-2 text-sm font-bold leading-6 text-gray-900">
                  {source.title}
                  <ExternalLink size={14} className="mt-1 shrink-0 text-gray-400" />
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{source.note}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
