import { ArrowDown, ArrowUpRight, BookOpen, Check, Code2, Terminal } from 'lucide-react'
import styles from './hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}><span /> BUILD WITH AI / 文字實作課</p>
          <h1>把你的想法，<br />做成<span>真的能用</span><br />的產品。</h1>
          <p className={styles.description}>跟著 Claude Code，逐步完成網站、登入、付款與部署。每一章都有操作指令、除錯方法，以及看得見的驗收結果。</p>
          <div className={styles.actions}>
            <a href="/login?next=%2Fdashboard%3Fcourse%3Dstarter-free" className={styles.primary}>先上免費預備課<ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href="#curriculum" className={styles.secondary}>瀏覽實作路線<ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <p className={styles.note}>從 4 章免費基礎開始 · 主課適合具備基本工程概念的人</p>
          <div className={styles.traits}><span><BookOpen size={14} aria-hidden="true" />照自己的節奏閱讀</span><span><Terminal size={14} aria-hidden="true" />複製指令，動手驗證</span></div>
        </div>
        <div className={styles.notebook} aria-label="課程學習方式示意">
          <div className={styles.notebookHeader}><span><Code2 size={17} aria-hidden="true" /> THE BUILD NOTES</span><span>學習方式示意</span></div>
          <div className={styles.page}>
            <p className={styles.chapter}>CHAPTER 01 / LANDING PAGE</p>
            <h2>你的第一個<br />產品首頁。</h2>
            <p className={styles.lessonDescription}>從一句模糊的想法，到可以開啟、瀏覽與修改的頁面。</p>
            <div className={styles.prompt}><span>01 · 給 AI 一個明確任務</span><p>「先建立課程首頁，包含主視覺、課程大綱與方案。完成後，告訴我怎麼在本機驗證。」</p></div>
            <div className={styles.checklist}><p>02 · 自己確認結果</p><span><Check size={15} aria-hidden="true" />首頁能在瀏覽器開啟</span><span><Check size={15} aria-hidden="true" />手機版文字與按鈕沒有溢出</span><span><Check size={15} aria-hidden="true" />每個按鈕都有明確去向</span></div>
          </div>
          <div className={styles.notebookFooter}><span>學習 → 實作 → 驗收</span><span>一章，完成一件事。</span></div>
        </div>
      </div>
    </section>
  )
}
