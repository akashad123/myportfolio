import React, { useEffect, useRef } from "react";
import data from "../data/portfolioData.json";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  SiReact, SiNextdotjs, SiTypescript, SiJavascript, 
  SiTailwindcss, SiGreensock, SiHtml5, 
  SiGit, SiGithub, SiVite, SiFramer 
} from 'react-icons/si';
import { FaCss3Alt } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// ── Shared Tech Stack Data ──────────────────────────────────────────────────
const techItems = [
  { Icon: SiReact, id: 'react' },
  { Icon: SiNextdotjs, id: 'next' },
  { Icon: SiTypescript, id: 'ts' },
  { Icon: SiJavascript, id: 'js' },
  { Icon: SiTailwindcss, id: 'tailwind' },
  { Icon: SiGreensock, id: 'gsap' },
  { Icon: SiHtml5, id: 'html5' },
  { Icon: FaCss3Alt, id: 'css3' }, /* Replaced missing SiCss3 perfectly */
  { Icon: SiGit, id: 'git' },
  { Icon: SiGithub, id: 'github' },
  { Icon: SiVite, id: 'vite' },
  { Icon: SiFramer, id: 'framer' }
];

// ── Native Nested LogoLoop Implementation ──────────────────────────────────
const LogoLoop = ({ items, speed = 90 }) => {
  const trackRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    // Map speed to physical duration mathematically 
    const calculatedDuration = 8000 / speed; 

    // Desktop Environment (Vertical Upwards Scroll)
    mm.add("(min-width: 768px)", () => {
      gsap.to(trackRef.current, {
        yPercent: -50,
        xPercent: 0,
        repeat: -1,
        duration: calculatedDuration,
        ease: "none",
        force3D: true
      });
    });

    // Mobile Environment (Horizontal Leftwards Scroll under content)
    mm.add("(max-width: 767px)", () => {
      gsap.to(trackRef.current, {
        xPercent: -50,
        yPercent: 0,
        repeat: -1,
        duration: calculatedDuration,
        ease: "none",
        force3D: true
      });
    });

    return () => mm.revert();
  }, [speed]);

  // Expand array seamlessly for math tracking loop constraints
  const loopElements = [...items, ...items];

  return (
    <div className="flex items-center w-full h-[100px] md:h-full logo-loop-mask">
      <div 
        ref={trackRef} 
        className="flex items-center logo-loop logo-track-pad"
      >
        {loopElements.map((item, index) => {
          const Icon = item.Icon;
          return (
            <div 
              key={`${item.id}-${index}`} 
              className="logo-item flex justify-center items-center shrink-0"
              style={{ height: '60px', width: '60px' }}
            >
              {/* Flawless baseline styling: solid white to deep orange on-hover */}
              <Icon 
                 className="w-full h-full text-[#FFFFFF] opacity-80 transition-all duration-300 ease-out cursor-default hover:text-[#E65100] hover:opacity-100 hover:scale-110" 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Reusable card layout (Card-less Timeline Style) ─────────────────────────
const ExpCard = ({ exp }) => (
  // 5. HOVER MICRO-INTERACTION: translate-x, slight brightness bump
  <div className="relative pl-10 md:pl-16 group transition-all duration-500 hover:translate-x-3 hover:brightness-110 cursor-default">
    
    {/* 2. TIMELINE STYLE: Vertical line connecting downward */}
    {/* Subtle gradient line fading out at bottom to look premium without boxes */}
    <div className="absolute left-[11px] md:left-[15px] top-12 bottom-[-10rem] w-[2px] bg-gradient-to-b from-white/25 to-transparent transition-colors duration-500 group-hover:from-[#FED7AA]/50" />
    
    {/* 7. ACCENT ELEMENTS: Glowing orange dot / marker */}
    <div className="absolute left-0 md:left-[4px] top-1 w-6 h-6 rounded-full flex items-center justify-center">
      {/* Core dot */}
      <div className="w-3 h-3 rounded-full bg-[#FED7AA] shadow-[0_0_12px_#FDBA74] z-10 transition-shadow duration-500 group-hover:shadow-[0_0_20px_#FFFFFF]" />
      {/* CSS glow pulse animation */}
      <div className="absolute w-full h-full rounded-full border border-[#FED7AA] animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50" />
    </div>

    {/* 4. TYPOGRAPHY HIERARCHY & 8. SPACING */}
    <div className="flex flex-col gap-6 pt-0">
      
      <div className="flex flex-col gap-2">
        {/* Role: Bright white, letter spacing */}
        <h3 className="text-4xl md:text-6xl font-display uppercase tracking-widest text-[#FFFFFF] leading-none mb-0 drop-shadow-md">
          {exp.role}
        </h3>
        
        {/* Company & Duration: Light orange */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 mt-1">
          <p className="text-xl md:text-2xl font-medium text-[#FDBA74] tracking-wide">
            {exp.company}
          </p>
          <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-[#FDBA74]/50" />
          <p className="text-sm md:text-base tracking-widest uppercase font-semibold text-[#FED7AA]/80">
            {exp.duration}
          </p>
        </div>
      </div>
      
      {/* Bullet points: Soft white, subtle opacity, custom marker arrow */}
      <ul className="space-y-4 list-none max-w-3xl mt-2">
        {exp.description.map((point, i) => (
          <li key={i} className="text-base md:text-xl text-[#F3F4F6] opacity-85 leading-relaxed relative pl-5 md:pl-7">
            {/* Custom minimalist arrow marker */}
            <span className="absolute left-0 top-[0.65em] w-1.5 h-1.5 border-t-2 border-r-2 border-[#FDBA74]/70 rotate-45 group-hover:border-[#FED7AA]" />
            {point}
          </li>
        ))}
      </ul>
      
    </div>
  </div>
);

// ── Main component ──────────────────────────────────────────────────────────
const Experience = () => {
  const sectionRef = useRef(null);
  const [exp1, exp2] = data.experience;

  useEffect(() => {
    // DO NOT change existing GSAP animations — constraint respected perfectly
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Phase 1 — Stratagile enters from below (0 → 1)
      tl.fromTo(
        ".exp-card-1",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      // Pause for reading (1 → 1.8)
      tl.to({}, { duration: 0.8 });

      // Phase 2 — Stratagile exits LEFT, Luminar enters from RIGHT (1.8 → 2.8)
      tl.to(".exp-card-1", {
        x: "-110%",
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      });
      tl.fromTo(
        ".exp-card-2",
        { x: "110%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.6"  // slight overlap for smooth cross-slide feel
      );

      // Heading subtle parallax across entire timeline
      tl.to(".exp-heading", { y: -30, ease: "none", duration: 2.8 }, 0);

      // Pause on Luminar (2.8 → 3.6)
      tl.to({}, { duration: 0.8 });

      // Phase 3 — Luminar exits upward → section unpins (3.6 → 4.6)
      tl.to(".exp-card-2", {
        y: -120,
        opacity: 0,
        duration: 1,
        ease: "power2.in",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ 
        minHeight: "300vh",
        // 1. UNIQUE BACKGROUND: Darker orange progression (#EA580C → #C2410C → #7C2D12)
        background: "linear-gradient(135deg, #EA580C 0%, #C2410C 45%, #7C2D12 100%)",
      }}
    >
      
      {/* 2. TEXTURE / RADIAL GLOW: Subtle light wash in the background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 60% 0%, rgba(253, 186, 116, 0.08) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      {/* Dynamic structural mapping for logo tracker layouts */}
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .logo-loop-mask {
             position: relative;
             overflow: visible;
          }
          .logo-loop {
             will-change: transform;
          }
          .logo-track-pad { gap: 60px; padding-top: 30px; padding-bottom: 30px; flex-direction: column; }
          .logo-loop-wrapper {
             position: relative;
             transform: translateY(-40px);
             height: 100%;
             width: 100%;
          }
        }
        @media (max-width: 767px) {
          .logo-loop-mask {
             position: relative;
             overflow: visible;
          }
          .logo-loop {
             will-change: transform;
          }
          .logo-track-pad { gap: 60px; padding-left: 30px; padding-right: 30px; flex-direction: row; }
          .logo-loop-wrapper {
             width: 100%;
             overflow: visible;
          }
        }
      `}} />

      {/* Sticky viewport grid conversion ensuring Left Layout completely isolates from Right Layout Banner */}
      <div className="sticky top-0 h-screen overflow-hidden px-6 md:px-16 pt-16 pb-8 md:py-20 flex flex-col md:grid md:grid-cols-[1fr_140px] lg:grid-cols-[1fr_160px] md:gap-10 items-center justify-between" style={{ zIndex: 10 }}>

        {/* LEFT COMPARTMENT (Content) */}
        <div className="w-full flex flex-col justify-center h-full relative">
          
          {/* 4. TYPOGRAPHY: Section title, large Bebas Neue, deep orange */}
          <h2 className="exp-heading text-6xl md:text-[80px] lg:text-[110px] mb-0 leading-[0.8] tracking-[8px] !text-[var(--color-orange-deep)] font-display uppercase drop-shadow-lg">
            Work Experience
          </h2>

          {/* Card stage mapping isolated from right banner bounds */}
          <div
            className="relative mt-8 md:mt-12 overflow-hidden flex-grow"
            style={{ minHeight: "55vh" }}
          >
            {/* Card 1 — Stratagile */}
            <div className="exp-card-1 absolute top-0 left-0 w-full opacity-0">
              <ExpCard exp={exp1} />
            </div>

            {/* Card 2 — Luminar (starts off-screen right) */}
            <div
              className="exp-card-2 absolute top-0 left-0 w-full"
              style={{ transform: "translateX(110%)", opacity: 0 }}
            >
              <ExpCard exp={exp2} />
            </div>
          </div>
        </div>

        {/* RIGHT COMPARTMENT (LogoLoop Banner Native Nesting) */}
        {/* Outer wrapper: column flex container — no transform here, shift is on logo-loop-wrapper */}
        <div 
          className="w-full md:w-full flex items-center justify-center mt-auto md:mt-0 h-full"
        >
          {/* logo-loop-wrapper: carries translateY shift + dual-edge mask fade via CSS only */}
          <div className="logo-loop-wrapper">
            <LogoLoop items={techItems} speed={160} />
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
