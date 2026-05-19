export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">AI</span>
              </div>
              <span className="font-bold text-white text-base">網課小韭菜</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              被網課騙過 NT$50,000 的人，教你用一個下午真正做出東西。
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">課程</p>
              <ul className="space-y-2">
                <li><a href="#curriculum" className="hover:text-white transition-colors text-xs">課程大綱</a></li>
                <li><a href="/market" className="hover:text-white transition-colors text-xs">市場分析</a></li>
                <li><a href="#instructor" className="hover:text-white transition-colors text-xs">關於講師</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors text-xs">立即購課</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors text-xs">常見問題</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">法律</p>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-white transition-colors text-xs">隱私權政策</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors text-xs">使用條款</a></li>
                <li><a href="/refund" className="hover:text-white transition-colors text-xs">退費政策</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} 網課小韭菜. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/_doro1998ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"
              aria-label="Instagram @_doro1998ai"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.32 4.14.62a5.86 5.86 0 0 0-2.13 1.39A5.86 5.86 0 0 0 .62 4.14C.32 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.25 2.15.55 2.91a5.86 5.86 0 0 0 1.39 2.13 5.86 5.86 0 0 0 2.13 1.39c.76.3 1.64.49 2.91.55C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.25 2.91-.55a5.86 5.86 0 0 0 2.13-1.39 5.86 5.86 0 0 0 1.39-2.13c.3-.76.49-1.64.55-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.25-2.15-.55-2.91a5.86 5.86 0 0 0-1.39-2.13A5.86 5.86 0 0 0 19.86.62C19.1.32 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
              </svg>
              <span>@_doro1998ai</span>
            </a>
            <p className="text-xs text-gray-600">
              Secure payments by{' '}
              <span className="text-gray-400">Stripe</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
