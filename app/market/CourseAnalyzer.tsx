'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, ClipboardList, Sparkles } from 'lucide-react'

const demandOptions = ['AI/自動化', '資料/分析', '資安/治理', '內容/創作', '職涯/作品集', '其他']
const proofOptions = ['沒有明確成果', '有範例截圖', '有完整作品', '有作業回饋/社群']
const audienceOptions = ['太廣泛', '明確身份', '明確痛點', '明確身份 + 痛點 + 場景']
const distributionOptions = ['只靠上架平台', '有社群/短影音', '有內容漏斗', '有企業/合作通路']

function scoreChoice(value: string, options: string[]) {
  const index = options.indexOf(value)
  return index < 0 ? 0 : index
}

export default function CourseAnalyzer() {
  const [title, setTitle] = useState('AI 自動化實戰課')
  const [price, setPrice] = useState('NT$990')
  const [demand, setDemand] = useState(demandOptions[0])
  const [proof, setProof] = useState(proofOptions[2])
  const [audience, setAudience] = useState(audienceOptions[2])
  const [distribution, setDistribution] = useState(distributionOptions[1])
  const [promise, setPromise] = useState('用 AI 做出一套可重複使用的工作流程')

  const result = useMemo(() => {
    const demandScore = demand === 'AI/自動化' || demand === '資安/治理' ? 3 : demand === '其他' ? 1 : 2
    const proofScore = scoreChoice(proof, proofOptions)
    const audienceScore = scoreChoice(audience, audienceOptions)
    const distributionScore = scoreChoice(distribution, distributionOptions)
    const promiseScore = promise.length >= 18 ? 2 : promise.length >= 8 ? 1 : 0
    const total = Math.min(100, Math.round(((demandScore + proofScore + audienceScore + distributionScore + promiseScore) / 14) * 100))

    const recommendations = []
    if (audienceScore < 2) recommendations.push('受眾太模糊，請改成「誰在什麼工作場景遇到什麼痛」。')
    if (proofScore < 2) recommendations.push('成交證據不足，補上可展示作品、前後對比或學員作業範例。')
    if (distributionScore < 2) recommendations.push('流量來源偏弱，設計免費內容漏斗：短文、短影音、免費課或檢查表。')
    if (promiseScore < 2) recommendations.push('承諾不夠具體，請寫成「完成後會得到哪個產出物」。')
    if (recommendations.length === 0) recommendations.push('這門課具備可賣雛形，下一步要驗證價格、試聽頁與第一批學員回饋。')

    return {
      total,
      label: total >= 78 ? '值得深入拆解' : total >= 58 ? '有機會，但要改定位' : '目前不適合照抄',
      recommendations,
    }
  }, [audience, demand, distribution, proof, promise])

  return (
    <section className="border-y border-gray-200 bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brand-500">
            <ClipboardList size={16} />
            Course Analyzer
          </p>
          <h2 className="text-3xl font-black text-gray-900">輸入一門競品課，快速判斷值不值得學</h2>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            這不是精準財務模型，而是一個定位檢查器：幫你看課程是否踩中 2026 的需求、是否有明確成果、是否有足夠成交證據。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-semibold text-gray-700">
                課程名稱
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                />
              </label>
              <label className="space-y-1.5 text-sm font-semibold text-gray-700">
                價格
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
                />
              </label>
              <Select label="需求類別" value={demand} onChange={setDemand} options={demandOptions} />
              <Select label="成交證據" value={proof} onChange={setProof} options={proofOptions} />
              <Select label="受眾清楚度" value={audience} onChange={setAudience} options={audienceOptions} />
              <Select label="流量來源" value={distribution} onChange={setDistribution} options={distributionOptions} />
            </div>
            <label className="mt-4 block space-y-1.5 text-sm font-semibold text-gray-700">
              課程承諾
              <textarea
                value={promise}
                onChange={(event) => setPromise(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-normal leading-6 text-gray-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-xl shadow-brand-500/5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">分析對象</p>
                <h3 className="mt-1 text-xl font-black text-gray-900">{title || '未命名課程'}</h3>
                <p className="mt-1 text-sm text-gray-500">{price}</p>
              </div>
              <div className="rounded-2xl bg-brand-50 px-4 py-3 text-center">
                <p className="text-xs font-semibold text-brand-500">Market Fit</p>
                <p className="text-3xl font-black text-brand-600">{result.total}</p>
              </div>
            </div>

            <div className="mb-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                {result.total >= 58 ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                {result.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-600">{promise}</p>
            </div>

            <div className="space-y-3">
              {result.recommendations.map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border border-gray-100 p-3">
                  <Sparkles size={16} className="mt-0.5 shrink-0 text-brand-500" />
                  <p className="text-sm leading-6 text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="space-y-1.5 text-sm font-semibold text-gray-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/10"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
