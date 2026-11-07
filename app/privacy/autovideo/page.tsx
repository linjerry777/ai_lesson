import Link from 'next/link'

export const metadata = {
  title: 'AutoVideo Publisher 隱私權政策與資料刪除說明 | Jerry AI Studio',
}

const EMAIL = 'donutai08@gmail.com'

function Mail() {
  return (
    <a href={`mailto:${EMAIL}`} className="text-green-600 underline">
      {EMAIL}
    </a>
  )
}

export default function AutoVideoPrivacyPage() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-2xl mx-auto prose prose-gray">
        {/* ============ 繁體中文 ============ */}
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          AutoVideo Publisher 隱私權政策與資料刪除說明
        </h1>
        <p className="text-gray-400 text-sm mb-8">生效日：2026-11-07（English version below）</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">一、營運者</h2>
          <p className="text-gray-600 leading-relaxed">
            AutoVideo Publisher 由 Jerry AI Studio 營運。聯絡信箱：<Mail />
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">二、用途</h2>
          <p className="text-gray-600 leading-relaxed">
            AutoVideo Publisher 是營運者自用的發布工具，只用來把營運者自己製作的短影音，發到營運者自己的
            Facebook 粉專（訊號滿格、麻糬QQ）、Instagram 帳號與 Threads 帳號。本工具不對外開放登入，也不蒐集其他使用者的資料。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">三、存取的資料</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>營運者自己的粉專清單與粉專權杖</li>
            <li>營運者自己的 Instagram／Threads 帳號 ID 與名稱</li>
            <li>發文結果（貼文 ID、連結）</li>
            <li>營運者自己內容的基本成效數字（觀看數）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">四、保存方式</h2>
          <p className="text-gray-600 leading-relaxed">
            權杖以 Windows DPAPI 加密，存放在營運者自己的電腦上，不分享、不販售給任何第三方。資料保存至授權被撤銷為止。
          </p>
        </section>

        <section id="data-deletion" className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">五、資料刪除</h2>
          <p className="text-gray-600 leading-relaxed">你可以用以下任一方式要求刪除資料：</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
            <li>
              寄信到 <Mail />，主旨寫「AutoVideo Publisher data deletion」，我們會在 30 天內刪除相關資料。
            </li>
            <li>
              自行移除授權：Facebook「設定 → 商業整合」，或 Instagram／Threads 的「應用程式和網站」，移除 AutoVideo Publisher。
            </li>
          </ul>
        </section>

        <hr className="my-10" />

        {/* ============ English ============ */}
        <h1 className="text-3xl font-black text-gray-900 mb-2">
          AutoVideo Publisher Privacy Policy and Data Deletion
        </h1>
        <p className="text-gray-400 text-sm mb-8">Effective date: 2026-11-07</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">1. Operator</h2>
          <p className="text-gray-600 leading-relaxed">
            AutoVideo Publisher is operated by Jerry AI Studio. Contact: <Mail />
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">2. Purpose</h2>
          <p className="text-gray-600 leading-relaxed">
            AutoVideo Publisher is an internal tool used only by the operator to publish the operator&apos;s own
            short videos to the operator&apos;s own Facebook Pages, Instagram account and Threads account. It does not
            offer login to the public and does not collect data from any other users.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">3. Data we access</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>The operator&apos;s own list of Pages and Page access tokens</li>
            <li>The operator&apos;s own Instagram / Threads account IDs and names</li>
            <li>Publishing results (post IDs and links)</li>
            <li>Basic performance metrics (view counts) of the operator&apos;s own content</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">4. Storage</h2>
          <p className="text-gray-600 leading-relaxed">
            Tokens are encrypted with Windows DPAPI and stored on the operator&apos;s own computer. They are never
            shared or sold. Data is retained until authorization is revoked.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">5. Data deletion</h2>
          <p className="text-gray-600 leading-relaxed">You can request deletion in either of these ways:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
            <li>
              Email <Mail /> with the subject &quot;AutoVideo Publisher data deletion&quot;. Related data will be
              deleted within 30 days.
            </li>
            <li>
              Remove the app yourself: Facebook &quot;Settings → Business Integrations&quot;, or Instagram / Threads
              &quot;Apps and Websites&quot;, then remove AutoVideo Publisher.
            </li>
          </ul>
        </section>

        <div className="border-t pt-6 mt-8">
          <Link href="/" className="text-green-600 text-sm hover:underline">← 返回首頁 / Home</Link>
        </div>
      </div>
    </div>
  )
}
