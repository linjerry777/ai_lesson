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
          <p className="text-xs text-gray-600">
            Secure payments by{' '}
            <span className="text-gray-400">Gumroad</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
