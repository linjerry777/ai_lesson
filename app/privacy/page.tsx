export const metadata = { title: '隱私權政策 | 網課小韭菜' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-2xl mx-auto prose prose-gray">
        <h1 className="text-3xl font-black text-gray-900 mb-2">隱私權政策</h1>
        <p className="text-gray-400 text-sm mb-8">最後更新：2025 年 6 月</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">一、我們收集哪些資料</h2>
          <p className="text-gray-600 leading-relaxed">
            當你使用本網站時，我們可能收集以下資料：
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
            <li>你的 Google 帳號 Email 和顯示名稱（透過 Google OAuth 登入）</li>
            <li>帳號大頭貼 URL（由 Google 提供）</li>
            <li>購課紀錄（購買時間、金額、幣別）</li>
          </ul>
          <p className="text-gray-600 mt-3">
            我們<strong>不儲存</strong>任何信用卡資訊。付款流程由 Gumroad 負責，本站不接觸卡片資料。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">二、資料用途</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>驗證你的登入狀態</li>
            <li>確認購課資格，讓你存取課程內容</li>
            <li>防止重複付款</li>
          </ul>
          <p className="text-gray-600 mt-3">我們不會將你的個人資料出售或提供給第三方行銷使用。</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">三、第三方服務</h2>
          <p className="text-gray-600 leading-relaxed">
            本網站使用以下第三方服務，各自有其隱私權政策：
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
            <li><strong>Supabase</strong>：用於使用者驗證與資料儲存</li>
            <li><strong>Google OAuth</strong>：用於第三方登入</li>
            <li><strong>Gumroad</strong>：用於付款處理</li>
            <li><strong>Vercel</strong>：用於網站託管</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">四、資料保留</h2>
          <p className="text-gray-600 leading-relaxed">
            你的帳號資料與購課紀錄將保留至你要求刪除為止。如需刪除帳號，請聯繫我們。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">五、你的權利</h2>
          <p className="text-gray-600 leading-relaxed">
            你有權要求查閱、更正或刪除我們持有的你的個人資料。請來信：
          </p>
          <p className="mt-2">
            <a href="mailto:donutai08@gmail.com" className="text-green-600 underline">
              donutai08@gmail.com
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">六、政策更新</h2>
          <p className="text-gray-600 leading-relaxed">
            本政策如有重大變更，將在本頁面公告並更新日期。繼續使用本網站即表示你同意最新版本的政策。
          </p>
        </section>

        <div className="border-t pt-6 mt-8">
          <a href="/" className="text-green-600 text-sm hover:underline">← 返回首頁</a>
        </div>
      </div>
    </div>
  )
}
