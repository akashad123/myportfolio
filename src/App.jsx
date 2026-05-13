import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Preloader from './components/Preloader';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ── Lenis smooth scroll ──────────────────────────────────
    const lenis = new Lenis({ smooth: true });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    if (isLoading) {
      lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenis.start();
      document.body.style.overflow = 'auto';
    }

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [isLoading]);

  return (
    <div className="bg-[#F97316] antialiased">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <Hero />        {/* pinned +=250%: frames → text fades → zoom+fade */}
      <About />       {/* pinned +=150%: word reveal (0→80%) → hold (20%) */}
      <Experience />  {/* pinned +=150%: line+items (0→80%) → hold (20%) */}
      <Skills />      {/* pinned +=200%: L/R rows (0→80%) → hold (20%) */}
      <Projects />    {/* pinned for horizontal sliding of massive background text tracks */}
      <Education />   {/* premium scroll-synced background reveal with SplitType staggered text */}
      <Contact />     {/* concluding call-to-action & footer */}
    </div>
  );
}

export default App;

