import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const phrases = [
  "Building Experience",
  "Loading Creativity",
  "Crafting Motion",
  "Designing Interaction",
  "Entering Portfolio"
];

const Preloader = ({ onComplete }) => {
  const containerRef = useRef(null);
  const emblemRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);
  const progressLineRef = useRef(null);
  const textRef = useRef(null);
  const particlesRef = useRef(null);
  const [currentPhrase, setCurrentPhrase] = useState(0);

  useEffect(() => {
    // Cycle phrases every 800ms
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // Initial State Setup
    gsap.set([emblemRef.current], { scale: 0.7, opacity: 0, filter: 'blur(15px)' });
    gsap.set(progressLineRef.current, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(textRef.current, { y: 20, opacity: 0 });
    gsap.set(particlesRef.current, { opacity: 0 });

    // Rotating rings infinite animation
    gsap.to(ring1Ref.current, { rotation: 360, duration: 10, repeat: -1, ease: 'linear', transformOrigin: '50% 50%' });
    gsap.to(ring2Ref.current, { rotation: -360, duration: 14, repeat: -1, ease: 'linear', transformOrigin: '50% 50%' });
    gsap.to(ring3Ref.current, { rotation: 360, duration: 18, repeat: -1, ease: 'linear', transformOrigin: '50% 50%' });

    // Main Sequence
    tl.to(particlesRef.current, {
      opacity: 1,
      duration: 2,
      ease: 'power4.inOut',
    })
    .to(emblemRef.current, {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 2.5,
      ease: 'power4.inOut',
    }, '-=1.5')
    .to(progressLineRef.current, {
      scaleX: 1,
      duration: 3.5,
      ease: 'power4.inOut',
    }, '-=2')
    .to(textRef.current, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: 'power4.out',
    }, '-=3')
    // Hold for a moment to let the user see it
    .to({}, { duration: 1 })
    // Outro Dissolve
    .to(containerRef.current, {
      opacity: 0,
      filter: 'blur(20px)',
      duration: 1.5,
      ease: 'power4.inOut',
    });

    return () => tl.kill();
  }, [onComplete]);

  // Orange particles
  const particles = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 4 + 3}s`,
    animationDelay: `${Math.random() * 3}s`
  }));

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Matte Dark Background with Subtle Orange Gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#1f1004] via-[#050505] to-[#050505]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#170a03] via-transparent to-transparent opacity-70" />

      {/* Cinematic noise texture overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Floating Particles Container */}
      <div ref={particlesRef} className="absolute inset-0 z-0 pointer-events-none">
        {particles.map((p) => (
          <div 
            key={p.id}
            className="absolute rounded-full bg-[#F97316] opacity-30 animate-pulse-slow shadow-[0_0_10px_#F97316]"
            style={{
              left: p.left,
              top: p.top,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Abstract Emblem / Logo Mark */}
        <div ref={emblemRef} className="relative w-32 h-32 md:w-40 md:h-40 mb-16 flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-[#F97316] rounded-full opacity-10 blur-[40px]" />
          
          {/* Geometric Rings */}
          <svg className="absolute inset-0 w-full h-full text-[#F97316]/90 overflow-visible" viewBox="0 0 100 100">
            <circle ref={ring1Ref} cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="60 40" className="drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            <circle ref={ring2Ref} cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="30 20 10 40" />
            <circle ref={ring3Ref} cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="10 10 40 20" />
            
            {/* Center Core */}
            <circle cx="50" cy="50" r="6" fill="#F97316" className="drop-shadow-[0_0_15px_rgba(249,115,22,1)]" />
          </svg>
        </div>

        {/* Loading Line Container */}
        <div className="w-64 md:w-96 h-[1px] bg-[#F97316]/15 relative overflow-hidden mb-10 rounded-full">
          <div 
            ref={progressLineRef}
            className="absolute top-0 left-0 h-full w-full bg-[#F97316] shadow-[0_0_15px_#F97316]"
          />
        </div>

        {/* Text */}
        <div className="h-6 overflow-hidden relative w-full flex justify-center items-center">
          <div 
            ref={textRef}
            className="text-[#F97316]/90 text-xs md:text-sm tracking-[0.25em] uppercase font-light drop-shadow-[0_0_5px_rgba(249,115,22,0.3)] transition-opacity duration-500 ease-in-out"
            key={currentPhrase}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {phrases[currentPhrase]}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
