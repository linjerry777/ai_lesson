import AiHelpComposer from '@/components/AiHelpComposer'
import Navbar from '@/components/Navbar'
import StickyBar from '@/components/StickyBar'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Curriculum from '@/components/sections/Curriculum'
import Instructor from '@/components/sections/Instructor'
import Pricing from '@/components/sections/Pricing'
import FAQ from '@/components/sections/FAQ'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <section id="ai-help" className="border-b border-stone-200 bg-[#f8f8f4] py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:px-8">
            <div className="lg:pt-6">
              <p className="text-xs font-semibold tracking-widest text-brand-700">課程工具 · 現在就能試</p>
              <h2 className="mt-4 text-3xl font-semibold leading-snug tracking-tight text-gray-900">卡住時，<br />讓 AI 看懂你的問題。</h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-600">整理目標、操作與錯誤訊息，產出一份能直接貼給 AI 的求助單。先提供脈絡，才能縮小除錯範圍。</p>
              <p className="mt-4 text-xs leading-6 text-gray-500">這是本機格式整理工具，不會呼叫模型，也不會自動送出你輸入的內容。</p>
            </div>
            <AiHelpComposer lessonTitle="AI 實作入門" />
          </div>
        </section>
        <Curriculum />
        <Instructor />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <StickyBar />
    </>
  )
}
