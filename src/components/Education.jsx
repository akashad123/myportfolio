import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import data from "../data/portfolioData.json";

gsap.registerPlugin(ScrollTrigger);

const Education = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 1024px)",
      isTablet: "(min-width: 768px) and (max-width: 1023px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isDesktop, isTablet } = context.conditions;

      if (isTablet) return; // 🔥 stop animation only on tablet

      if (isDesktop) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=120%",       // slightly reduced for tighter feel
            scrub: true,
            pin: true,
            anticipatePin: 1
          }
        });

        // 1. Headings animate first (from bottom)
        tl.from(".section-title", { y: 100, opacity: 0, duration: 1 });
        // 2. Left & right content slide in simultaneously
        tl.from(".edu-left", { x: -120, opacity: 0 }, 0.2);
        tl.from(".edu-right", { x: 120, opacity: 0 }, 0.2);
        // 3. Divider grows top to bottom
        tl.from(".divider", { scaleY: 0, transformOrigin: "top" }, 0.3);
        // 4. Cards stagger in for readability
        tl.from(".edu-card, .cert-card", { y: 60, opacity: 0, stagger: 0.2 }, 0.4);
      } else {
        // MOBILE ONLY - Disable Pinning & Complex Stacking (Normal Vertical Flow)
        gsap.from(".edu-left", {
          opacity: 0, y: 50, duration: 0.6,
          scrollTrigger: { trigger: ".edu-left", start: "top 85%" }
        });
        gsap.from(".edu-right", {
          opacity: 0, y: 50, duration: 0.6,
          scrollTrigger: { trigger: ".edu-right", start: "top 85%" }
        });
      }
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} className="education-section">
      <style dangerouslySetInnerHTML={{
        __html: `
        .education-section {
          position: relative;
          min-height: 100vh;
          padding: 100px 8%;
          overflow: visible;
          background: linear-gradient(135deg, #F97316, #E65100);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .edu-wrapper {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 80px;
          row-gap: 40px;
          align-items: start;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .edu-left,
        .edu-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: flex-start;
          width: 100%;
          opacity: 1;
        }

        /* ----- FONT FIX & HEADINGS ----- */
        .section-title {
          font-family: 'Bungee', sans-serif !important;
          font-weight: 800;
          letter-spacing: 4px;
          color: #7C2D12 !important;
          font-size: clamp(2rem, 4vw, 4.5rem);
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          margin-bottom: 30px;
        }

        /* ----- VERTICAL LINE ----- */
        .divider {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 120px;
          bottom: 0;
          width: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        /* ----- CARDS ----- */
        .edu-card,
        .cert-card {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          padding: 24px 24px 24px 32px;
          transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          position: relative;
          overflow: hidden;
        }

        .edu-card::before,
        .cert-card::before {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 4px;
          height: 0%;
          background: #E65100;
          opacity: 0;
          transition: height 0.4s ease, opacity 0.3s ease;
        }

        .edu-card:hover::before,
        .cert-card:hover::before {
          height: 100%;
          opacity: 1;
        }

        .edu-card h3,
        .cert-card h3 {
          font-family: 'Inter', sans-serif !important;
          font-weight: 700;
          font-size: 1.3rem;
          color: #FFFFFF !important;
          margin-bottom: 0px;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .edu-card h3::after,
        .cert-card h3::after {
          content: "";
          display: block;
          height: 2px;
          width: 40px;
          background: rgba(255,255,255,0.5);
          margin: 10px 0;
          transition: width 0.4s ease, background 0.4s ease;
        }

        .edu-card:hover h3::after,
        .cert-card:hover h3::after {
          width: 100%;
          background: #E65100;
        }

        .edu-card p,
        .cert-card p {
          font-family: 'Inter', sans-serif !important;
          color: rgba(255, 255, 255, 0.7) !important;
          font-size: 1rem;
        }

        .edu-card:hover,
        .cert-card:hover {
          transform: translateX(5px);
         
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .education-section,
          .certifications-section,
          .edu-right {
            position: relative !important;
            transform: none !important;
          }
          
          /* Forced column flow for Tablet */
          .edu-wrapper {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
        }

        .education-section h2 {
          position: relative;
          z-index: 2;
        }

        .certifications-section,
        .edu-right {
          margin-top: 24px;
        }

        @media (max-width: 768px) {
          /* Prevent Overlap / Fix Height Constraints */
          .education-section {
             position: relative !important;
             z-index: 10 !important;
             margin-top: 0 !important;
             padding-top: 60px !important;
             padding-bottom: 40px !important;
             padding-left: 16px !important;
             padding-right: 16px !important;
             overflow: visible !important;
             align-items: flex-start !important; /* Prevents overflow clipping when centered */
          }

          /* Container width explicitly locked for tight layout */
          .edu-wrapper {
            display: flex;
            flex-direction: column;
            gap: 0;
            width: 100% !important;
            max-width: 420px !important;
            margin: 0 auto !important;
          }

          /* "space-y-3" equivalent mapped safely */
          .edu-left, .edu-right {
            width: 100%;
            gap: 12px !important;
          }

          /* Education specific tweaking */
          .edu-left {
             margin-bottom: 8px !important;
          }
          
          /* Headings clamp / sizing */
          .section-title {
            text-align: center;
            font-size: 26px !important;
            margin-top: 0 !important;
            margin-bottom: 16px !important;
            line-height: 1.2 !important;
          }
          
          /* Certifications spacing & overlap prevention */
          .edu-right {
             position: relative !important;
             z-index: 10 !important;
             margin-top: 24px !important;
             margin-bottom: 12px !important;
          }

          /* Safe Card constraints */
          .edu-card, .cert-card {
            width: 100%;
            padding: 12px 16px !important;
            border-radius: 8px !important;
            border-color: rgba(255, 255, 255, 0.3) !important;
          }
          
          .edu-card h3, .cert-card h3 {
            font-size: 1rem !important;
          }
          .edu-card p, .cert-card p {
            font-size: 0.85rem !important;
            margin-top: 4px !important;
          }
          .divider {
            display: none;
          }
        }
      `}} />

      <div className="edu-wrapper">
        <div className="edu-left">
          <h2 className="section-title">EDUCATION</h2>

          {data.education && data.education.map((item, index) => (
            <div key={index} className="edu-card">
              <h3>{item.degree}</h3>
              <p>{item.institution} | {item.duration}</p>
            </div>
          ))}
        </div>

        <div className="divider"></div>

        <div className="edu-right">
          <h2 className="section-title cert-title">CERTIFICATIONS</h2>

          <div className="cert-card">
            <h3>MERN Stack Web Development</h3>
            <p>Luminar Technolab (2023)</p>
          </div>
          <div className="cert-card">
            <h3>IoT Application Development</h3>
            <p>ICT Academy of Kerala (2022)</p>
          </div>
          <div className="cert-card">
            <h3>Cyber Security</h3>
            <p>(2022)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
