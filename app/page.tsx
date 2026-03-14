import Navbar from '@/components/nav/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Process from '@/components/sections/Process'
import Stack from '@/components/sections/Stack'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/sections/Footer'

export default function Home() {
  return (
    <main className="pb-36">
      <Navbar />
      <Hero />
      <div className="border-t border-border" />
      <About />
      <div className="border-t border-border" />
      <Projects />
      <div className="border-t border-border" />
      <Process />
      <div className="border-t border-border" />
      <Stack />
      <div className="border-t border-border" />
      <Contact />
      <Footer />
    </main>
  )
}
