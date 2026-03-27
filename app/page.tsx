import Navbar from '@/components/Navbar'
import StickyBar from '@/components/StickyBar'
import Hero from '@/components/sections/Hero'
import Stats from '@/components/sections/Stats'
import Problems from '@/components/sections/Problems'
import Curriculum from '@/components/sections/Curriculum'
import Testimonials from '@/components/sections/Testimonials'
import Instructor from '@/components/sections/Instructor'
import Comparison from '@/components/sections/Comparison'
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
        <Problems />
        <Curriculum />
        <Testimonials />
        <Instructor />
        <Comparison />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
      <StickyBar />
    </>
  )
}
