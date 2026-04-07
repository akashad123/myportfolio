import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "../data/portfolioData.json";
import { 
  SiReact, SiTailwindcss, SiJavascript, SiHtml5,
  SiNodedotjs, SiExpress, SiPostman, SiMongodb, SiMysql
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa";
import { LuShieldCheck, LuGauge, LuBoxes } from "react-icons/lu";

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Elements
      const wrapper = document.querySelector(".quad-wrapper");
      const inners = gsap.utils.toArray(".card-inner");
      
      // Reset flip internals securely
      gsap.set(inners, { rotationY: 0 });
      gsap.set(".pill-grid .skill-pill", { y: 20, opacity: 0 });
      
      // PHASE 1 — INITIAL STATE
      // Wrapper natively locked to the exact center.
      gsap.set([wrapper], { 
        xPercent: -50, 
        yPercent: -50,
        left: "50%",
        top: "50%",
        width: "min(90vw, 520px)",
        height: "260px"
      });

      // Cards natively snap to corners of the 520x260 wrapper (50% w/h = 260x130)
      gsap.set(".card-tl", { top: 0, left: 0, x: 0, y: 0, rotation: 0 });
      gsap.set(".card-tr", { top: 0, right: 0, x: 0, y: 0, rotation: 0 });
      gsap.set(".card-bl", { bottom: 0, left: 0, x: 0, y: 0, rotation: 0 });
      gsap.set(".card-br", { bottom: 0, right: 0, x: 0, y: 0, rotation: 0 });

      // Maintain scene center for phase 7 zoom
      gsap.set(".skills-scene", { transformOrigin: "center center" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2500", // Smooth scrub duration for entire sequence
          scrub: 1, // Smooth cinematic scrub
          pin: true,
          anticipatePin: 1
        }
      });

      // PHASE 2 — STRETCH
      // ONLY horizontally first, then slightly vertically.
      tl.to([wrapper], {
        width: "min(95vw, 1000px)",
        duration: .5,
        ease: "power3.inOut" // Smooth, elastic but controlled, no bounce
      }, "stretch");

      tl.to([wrapper], {
        height: "380px",
        duration: .5,
        ease: "power3.inOut"
      }, "stretch+=1"); // Offset heavily so horizontal expands out completely before vertical catches up

      // Quick visual pause for the stable 1000x380 block
      tl.to({}, { duration: 0.5 }); 

      // PHASE 3 & 4 — PERFECT SPLIT into 2x2 grid & POSITION
      // No initial gap, then they smoothly split apart exactly as requested.
      const gap = 15; // px shift
      tl.to(".card-tl", { x: -gap, y: -gap, rotation: -2, duration: 2, ease: "power3.inOut" }, "split");
      tl.to(".card-tr", { x: gap, y: -gap, rotation: 2, duration: 2, ease: "power3.inOut" }, "split");
      tl.to(".card-bl", { x: -gap, y: gap, rotation: -2, duration: 2, ease: "power3.inOut" }, "split");
      tl.to(".card-br", { x: gap, y: gap, rotation: 2, duration: 2, ease: "power3.inOut" }, "split");

      // Pause to appreciate the split grid
      tl.to({}, { duration: 0.5 }); 

      // PHASE 5 & 6 — Y-AXIS FLIP ANIMATION & REVEAL
      // Slight stagger, smooth flip
      tl.to(inners, {
        rotationY: 180,
        duration: 2.5,
        ease: "power3.inOut",
        stagger: 0.15
      }, "flip");

      // Stagger reveal the back side content synchronously
      tl.to(".pill-grid .skill-pill", { 
        y: 0, 
        opacity: 1, 
        stagger: 0.05, 
        duration: 1, 
        ease: "power3.out" 
      }, "flip+=1.5"); // Triggers past the halfway rotation mark

      // Pause to let user safely read the skill data before exiting scroll
      tl.to({}, { duration: 1.5 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Use raw JSON data explicitly securely
  const getGroup = (title) => data.skills.find(g => g.title.toLowerCase() === title.toLowerCase())?.items || [];
  
  // Data extraction mapping explicit user icon matrix to structure
  const quadData = {
    tl: { 
      title: "Frontend", 
      Icon: SiReact,
      items: [
        { name: "React", Icon: SiReact },
        { name: "Tailwind", Icon: SiTailwindcss },
        { name: "JavaScript", Icon: SiJavascript },
        { name: "HTML", Icon: SiHtml5 },
        { name: "CSS", Icon: FaCss3Alt }
      ] 
    },
    tr: { 
      title: "Backend", 
      Icon: SiNodedotjs,
      items: [
        { name: "Node.js", Icon: SiNodedotjs },
        { name: "Express.js", Icon: SiExpress },
        { name: "REST APIs", Icon: SiPostman }
      ] 
    },
    bl: { 
      title: "Database", 
      Icon: SiMongodb,
      items: [
        { name: "MongoDB", Icon: SiMongodb },
        { name: "MySQL", Icon: SiMysql }
      ] 
    },
    br: { 
      title: "Concepts", 
      Icon: LuBoxes,
      items: [
        { name: "Authentication", Icon: LuShieldCheck },
        { name: "Performance", Icon: LuGauge },
        { name: "Component Architecture", Icon: LuBoxes }
      ] 
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Premium Soft Glass UI Specifications (Identical clean constraints) */
        .glass-ui-core {
          background: rgba(255, 255, 255, 0.05); /* very light, no dark overhead */
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1); /* light, minimal shadow */
          overflow: hidden;
        }

        .quad-card {
          perspective: 1500px;
          position: absolute;
          width: 50%;
          height: 50%;
        }

        .card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
        }

        /* Essential 3D backface mechanism */
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        /* 📱 RESPONSIVE MOBILE OVERRIDES (1-COLUMN STACK) */
        @media (max-width: 767px) {
          .quad-wrapper {
             width: 95vw !important;
             height: 65vh !important;
             min-height: 520px !important;
          }
          .quad-card {
             width: 100% !important;
             height: 25% !important;
          }
          .card-tl { top: 0% !important; left: 0 !important; bottom: auto !important; right: auto !important; }
          .card-tr { top: 25% !important; left: 0 !important; bottom: auto !important; right: auto !important; }
          .card-bl { top: 50% !important; left: 0 !important; bottom: auto !important; right: auto !important; }
          .card-br { top: 75% !important; left: 0 !important; bottom: auto !important; right: auto !important; }

          .card-front, .card-back {
            border-radius: 12px !important;
          }

          .card-back {
             padding: 12px !important;
          }
          
          .card-title {
             font-size: 20px !important;
             margin-bottom: 8px !important;
          }
          
          .pill-grid {
             gap: 4px !important;
          }
          
          .skill-pill {
             padding: 4px 8px !important;
             font-size: 11px !important;
          }
          
          .wrapper {
             max-width: 95% !important;
          }
        }

        /* Front side specifically structured cleanly */
        .card-front {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Back side heavily padded for skill data layout */
        .card-back {
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          padding: 24px;
          justify-content: center;
          align-items: center;
        }

        .card-title {
          color: #ffffff;
          font-weight: 700;
          letter-spacing: 2px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        
        .skill-pill {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          color: #ffffff;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .quad-wrapper {
          position: absolute;
          /* Managed explicitly inside GSAP Initial Phase */
        }
        `
      }} />

      <section
        ref={sectionRef}
        className="skills-section h-screen w-full relative overflow-hidden flex flex-col justify-start pt-[40px] md:pt-[60px] max-sm:px-4"
        style={{
          background: "linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%)",
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(0,0,0,0.15), transparent 50%)
            `
          }}
        />

        {/* STATIC EXTERNAL HEADING */}
        <h2 
          className="z-50 font-display uppercase text-center w-full relative !text-[#7C2D12] max-sm:mb-4"
          style={{
            fontWeight: 800,
            fontSize: "clamp(28px, 6vw, 4.5rem)",
            letterSpacing: "4px",
            textShadow: "0 4px 12px rgba(0,0,0,0.25)",
            marginTop: "0"
          }}
        >
          SKILLS
        </h2>

        {/* Card Global Target */}
        <div className="skills-scene relative w-full flex-1 z-10 pointer-events-none">

         

          {/* Core Master Boundary Box for the precise 2x2 Grid setup */}
          <div className="quad-wrapper z-20 pointer-events-auto rounded-[20px]">
            
            {/* Core Iterated Boundary Boxes for the precise 2x2 Grid setup */}
            {Object.entries(quadData).map(([key, data]) => {
              // Extract hardcoded geometry perfectly dynamically
              const bounds = {
                tl: { front: { borderTopLeftRadius: "20px" }, back: { borderTopLeftRadius: "20px", borderTopRightRadius: "0", borderBottomLeftRadius: "0" } },
                tr: { front: { borderTopRightRadius: "20px" }, back: { borderTopRightRadius: "20px", borderTopLeftRadius: "0", borderBottomRightRadius: "0" } },
                bl: { front: { borderBottomLeftRadius: "20px" }, back: { borderBottomLeftRadius: "20px", borderTopLeftRadius: "0", borderBottomRightRadius: "0" } },
                br: { front: { borderBottomRightRadius: "20px" }, back: { borderBottomRightRadius: "20px", borderTopRightRadius: "0", borderBottomLeftRadius: "0" } },
              }[key];

              const MainIcon = data.Icon;

              return (
                <div key={key} className={`quad-card card-${key}`} style={bounds.front}>
                  <div className="card-inner">
                    <div className="card-front" style={bounds.front}>
                      <h3 className="card-title font-display uppercase text-[clamp(24px,3vw,40px)] opacity-90 flex items-center justify-center gap-3">
                        <MainIcon className="text-white opacity-95" size={32} />
                        {data.title}
                      </h3>
                    </div>
                    <div className="card-back" style={bounds.back}>
                      <div className="wrapper w-full max-w-[90%] mx-auto text-left">
                        <h3 className="card-title font-display uppercase text-[clamp(20px,2.5vw,32px)] border-b border-white/20 pb-2 mb-4 w-full flex items-center gap-3">
                          <MainIcon className="text-white opacity-95" size={24} />
                          {data.title}
                        </h3>
                        <div className="pill-grid flex flex-wrap gap-2 md:gap-3">
                          {data.items.map((skill, idx) => {
                            const SkillIcon = skill.Icon;
                            return (
                              <span key={idx} className="skill-pill px-3 py-1.5 font-sans text-xs md:text-sm rounded-full flex items-center gap-[6px] group transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer">
                                <SkillIcon className="text-[#FFFFFF] opacity-90 transition-colors duration-300 group-hover:text-[#E65100]" size={18} />
                                <span className="group-hover:text-white transition-colors duration-300 pointer-events-none">{skill.name}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

      </section>
    </>
  );
};

export default Skills;
