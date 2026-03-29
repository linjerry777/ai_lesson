export const metadata = { title: '使用條款 | 網課小韭菜' }

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-2xl mx-auto prose prose-gray">
        <h1 className="text-3xl font-black text-gray-900 mb-2">使用條款</h1>
        <p className="text-gray-400 text-sm mb-8">最後更新：2025 年 6 月</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">一、服務說明</h2>
          <p className="text-gray-600 leading-relaxed">
            「網課小韭菜」（以下簡稱「本服務」）提供線上課程影片供購課學員自行觀看學習。購課後，你可在本平台永久存取你所購買的課程內容。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">二、帳號與存取</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>你須透過 Google 帳號登入以存取課程內容</li>
            <li>你的帳號僅供個人使用，不得分享給他人</li>
            <li>你有責任保管帳號安全</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">三、智慧財產權</h2>
          <p className="text-gray-600 leading-relaxed">
            課程所有內容（影片、文字、程式碼範例）的著作權屬於「網課小韭菜」。購課後你取得個人學習授權，但<strong>不得</strong>：
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
            <li>錄製、複製或散布課程影片</li>
            <li>將課程內容用於商業轉售</li>
            <li>分享登入帳號讓未購課者存取</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">四、付款</h2>
          <p className="text-gray-600 leading-relaxed">
            購課透過 Gumroad 平台完成付款。本服務不儲存任何付款卡片資訊。付款完成後，你的 Email 所對應帳號將自動開通課程存取權。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">五、免責聲明</h2>
          <p className="text-gray-600 leading-relaxed">
            課程內容以教學為目的，提供技術知識與實作示範。課程中涉及的第三方服務（Supabase、Vercel、Google OAuth 等）可能隨時更新其介面或政策，本服務不對因此造成的操作差異負責。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">六、條款修改</h2>
          <p className="text-gray-600 leading-relaxed">
            本服務保留隨時修改使用條款的權利。重大變更將在本頁面公告。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">七、聯絡我們</h2>
          <p className="text-gray-600">
            如有任何問題，請聯繫：{' '}
            <a href="mailto:donutai08@gmail.com" className="text-green-600 underline">
              donutai08@gmail.com
            </a>
          </p>
        </section>

        <div className="border-t pt-6 mt-8">
          <a href="/" className="text-green-600 text-sm hover:underline">← 返回首頁</a>
        </div>
      </div>
    </div>
  )
}
