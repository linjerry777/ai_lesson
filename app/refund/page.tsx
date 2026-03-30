export const metadata = { title: '退費政策 | 網課小韭菜' }

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-2xl mx-auto prose prose-gray">
        <h1 className="text-3xl font-black text-gray-900 mb-2">退費政策</h1>
        <p className="text-gray-400 text-sm mb-8">最後更新：2026 年 3 月</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">7 天退費保證</h2>
          <p className="text-gray-600 leading-relaxed">
            如果你在購課後 <strong>7 天內</strong>對課程內容不滿意，可以申請全額退費，無需說明理由。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">退費條件</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>購課後 7 天內（168 小時內）提出申請</li>
            <li>使用購課時的 Email 聯繫我們</li>
            <li>退費後，你的課程存取權將被關閉</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">如何申請退費</h2>
          <p className="text-gray-600 leading-relaxed">
            請來信 <a href="mailto:donutai08@gmail.com" className="text-green-600 underline">donutai08@gmail.com</a>，主旨填「退費申請」，並附上：
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
            <li>購課 Email</li>
            <li>購課日期或訂單編號</li>
          </ul>
          <p className="text-gray-600 mt-3">
            我們將在 <strong>3 個工作天內</strong>回覆並處理退款。退款金額依 Gumroad 平台退款方式返還。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">不適用退費的情況</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>購課超過 7 天後提出申請</li>
            <li>違反使用條款（如分享帳號、散布課程內容）</li>
          </ul>
        </section>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-6">
          <p className="text-green-800 text-sm font-semibold mb-1">有任何問題？</p>
          <p className="text-green-700 text-sm">
            歡迎在購課前先來信詢問，我們很樂意幫你評估這堂課是否適合你：{' '}
            <a href="mailto:donutai08@gmail.com" className="underline">donutai08@gmail.com</a>
          </p>
        </div>

        <div className="border-t pt-6 mt-8">
          <a href="/" className="text-green-600 text-sm hover:underline">← 返回首頁</a>
        </div>
      </div>
    </div>
  )
}
