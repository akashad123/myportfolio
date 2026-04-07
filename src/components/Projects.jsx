import React, { useEffect, useRef } from "react";
import data from "../data/portfolioData.json";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    // Exact GSAP animation logic correctly preserved
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const track = trackRef.current;

      const init = () => {
        const totalWidth = track.scrollWidth - window.innerWidth;

        // Horizontally scroll the track
        gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            pinSpacing: true
          },
        });

        // Very slow subtle drift movement for the heading
        gsap.to(".featured-heading", {
          x: -250,
          opacity: 0.8,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 2.5
          }
        });

        ScrollTrigger.refresh();
      };

      init();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="projects-zarcero-section">
      <style dangerouslySetInnerHTML={{
        __html: `
        /* 1. BACKGROUND — ORANGE THEME */
        .projects-zarcero-section {
          height: 100vh;
          overflow: hidden;
          position: relative;
          margin-top: 0;
          margin-bottom: 0;
          padding-top: 80px;
          isolation: isolate; 
          background: linear-gradient(135deg, #F97316 0%, #EA580C 50%, #C2410C 100%);
        }

        /* 1. LAYER - Radial depth */
        .projects-zarcero-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08), transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(0,0,0,0.15), transparent 50%);
          z-index: 1;
          pointer-events: none;
        }
        
        /* 2. HEADING STYLE */
        .featured-heading {
          position: absolute;
          top: 60px;
          left: 80px;
          z-index: 20;
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: clamp(2rem, 6vw, 4.5rem);
          letter-spacing: 4px;
          color: #7C2D12 !important;
          margin: 0;
          line-height: 1;
          pointer-events: none;
          font-weight: 800;
        }

        .zarcero-track {
          display: flex;
          height: 100%;
          width: max-content;
          gap: 120px;
          position: relative;
          z-index: 5;
        }

        .zarcero-slide {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding-left: 100px;
        }

        /* 7. BACKGROUND TEXT */
        .project-bg {
          position: absolute;
          font-family: 'Bebas Neue', sans-serif !important;
          font-size: 16vw;
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          opacity: 0.05;
          white-space: nowrap;
          z-index: 0; 
          pointer-events: none;
          color: #FFF !important;
          margin: 0;
          line-height: 1;
        }

        .project-card {
          position: relative;
          padding: 32px;
          width: 100%;
          max-width: 700px;
          overflow: hidden;
          z-index: 5;
        }

        .project-content {
          position: relative;
          z-index: 2;
          opacity: 0.95;
        }

        /* 3. PROJECT TITLE */
        .project-content h2 {
          font-family: 'Inter', sans-serif !important;
          font-weight: 700;
          font-size: clamp(28px, 3vw, 48px);
          letter-spacing: 1px;
          color: #FFFFFF !important;
          margin-bottom: 24px;
          line-height: 1.1;
        }

        /* 4. DESCRIPTION TEXT */
        .project-content ul {
          margin: 20px 0;
          font-family: 'Inter', sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.7;
          letter-spacing: 0.3px;
          max-width: 520px;
          opacity: 0.9;
          padding-left: 20px;
          list-style: none; /* Modern editorial feel */
        }

        .project-content li {
          color: rgba(255,255,255,0.85) !important;
          margin-bottom: 12px;
          position: relative;
        }
          
        /* Custom minimalist bullet point */
        .project-content li::before {
          content: "";
          position: absolute;
          left: -18px;
          top: 8px;
          width: 6px;
          height: 1px;
          background: rgba(255,255,255,0.5);
        }

        /* 5. TECH STACK TAGS */
        .zarcero-tech {
          margin: 32px 0 36px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .zarcero-tech span {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          padding: 6px 14px;
          border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-weight: 500;
          font-size: 12px;
          color: #fff;
          backdrop-filter: blur(6px);
          transition: all 0.3s ease;
        }

        .zarcero-tech span:hover {
          background: rgba(255,255,255,0.25);
          border-color: rgba(255,255,255,0.4);
          transform: translateY(-2px);
        }

        /* 6. BUTTON STYLE */
        .zarcero-buttons {
          display: flex;
          gap: 16px;
        }

        .zarcero-buttons a {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.3);
          padding: 10px 24px;
          font-size: 13px;
          letter-spacing: 1px;
          color: white !important;
          border-radius: 6px;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
          text-transform: uppercase;
        }

        .zarcero-buttons a:hover {
          background: white;
          color: #C2410C !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          .projects-zarcero-section {
            padding-top: 40px;
          }
          .featured-heading {
            left: 0;
            width: 100%;
            text-align: center;
            font-size: clamp(2rem, 7vw, 3.5rem);
            margin-bottom: 20px;
          }
          .project-bg {
            font-size: 20vw; /* Tone down watermark size slightly on mobile */
          }
          .project-card {
            padding: 16px;
            width: 100%;
          }
          .project-content h2 {
            font-size: clamp(1.8rem, 5vw, 3rem);
            line-height: 1.2;
          }
          .project-content ul {
            font-size: 0.9rem;
          }
          .zarcero-slide {
            padding-left: 16px;
            padding-right: 16px;
            flex-direction: column;
            justify-content: center;
          }
          .zarcero-tech {
            flex-wrap: wrap;
            gap: 8px;
          }
        }
      `}} />

      <h2 className="featured-heading">FEATURED WORKS</h2>

      <div ref={trackRef} className="zarcero-track">
        {data.projects.map((p, i) => (
          <div className="zarcero-slide" key={i}>
            <h1 className="project-bg">{p.title}</h1>

            <div className="project-card">
              <div className="project-content">
                <h2>{p.subtitle}</h2>
                <ul>
                  {p.description.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>

                <div className="zarcero-tech">
                  {p.tech.map((t, idx) => (
                    <span key={idx}>{t}</span>
                  ))}
                </div>

                <div className="zarcero-buttons">
                  {p.github !== "#" && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer">VIEW PROJECT</a>
                  )}
                  {p.live !== "#" && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer">VISIT SITE</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
