import { BookOpen, Users, Code2, Award } from 'lucide-react'

const credentials = [
  { icon: Code2, text: '多年業界全端開發實戰經驗' },
  { icon: Users, text: '帶領 100+ 位工程師導入 AI 工作流' },
  { icon: BookOpen, text: 'AI 工程技術暢銷書作者' },
  { icon: Award, text: '頂尖科技公司 AI-first 開發實踐者' },
]

export default function Instructor() {
  return (
    <section id="instructor" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-500 font-semibold text-sm mb-2 uppercase tracking-wider">
            關於講師
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
            你的課程講師
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar placeholder */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-4xl font-black">[講]</span>
                </div>
                <p className="text-center text-xs text-gray-400 mt-2">講師照片</p>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  [講師姓名]
                </h3>
                <p className="text-brand-500 font-semibold text-sm mb-4">
                  資深全端工程師 / AI 開發顧問
                </p>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  擁有多年業界軟體開發經驗，目前在頂尖科技公司任職，深度使用 Claude Code
                  作為核心開發工具。曾帶領多個工程團隊完整導入 AI-first 開發工作流，
                  在實際商業專案中驗證了這套方法論的效果。
                  <br /><br />
                  活躍於台灣工程師社群，以「把複雜技術拆解成可立即使用的方法論」的教學風格受到學員好評。
                  課程內容 100% 來自真實工作場景，不教你按按鈕，只教你真正做到事情。
                </p>

                <div className="grid sm:grid-cols-2 gap-3">
                  {credentials.map((cred) => (
                    <div key={cred.text} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <cred.icon size={14} className="text-brand-600" />
                      </div>
                      <span className="text-gray-700 text-xs">{cred.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
