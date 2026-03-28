import { BookOpen, TrendingDown, Zap, DollarSign } from 'lucide-react'

const credentials = [
  { icon: DollarSign,   text: '累計被騙網課費用 NT$50,000+' },
  { icon: TrendingDown, text: '學完歸零，作品數量依然是 0' },
  { icon: Zap,          text: '某個下午被 Claude Code 改變人生' },
  { icon: BookOpen,     text: '現在靠賣這堂課努力把錢賺回來' },
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
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src="/instructor.png"
                  alt="小韭菜講師"
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  小韭菜
                </h3>
                <p className="text-brand-500 font-semibold text-sm mb-4">
                  資深網課受害者 / 現已康復
                </p>

                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  擁有多年購買網課的豐富經驗——每堂都有「業界實戰」四個字，
                  每堂都教 Todo List，每堂結束後依然做不出任何東西。
                  累積課費超過 NT$50,000，換來一整個硬碟的 mp4 和深深的空虛感。
                  <br /><br />
                  直到某個下午，用 Claude Code 一個指令就把你現在看到的這個網站建起來了。
                  當下只有一個念頭：<strong className="text-gray-900">幹，原來是這樣。</strong>
                  於是把整個過程錄下來，做成這堂課，
                  試圖從你身上把之前被騙的錢賺回來——但這次是真的教你做出東西。
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
