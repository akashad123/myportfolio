import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  useEffect(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isDesktop } = context.conditions;

      if (isDesktop) {
        // Section pin for premium feel
        ScrollTrigger.create({
          trigger: ".contact-section",
          start: "top top",
          end: "+=80%",
          scrub: true,
          pin: true
        });

        // Fade section in from below
        gsap.from(".contact-section", {
          y: 80,
          opacity: 0,
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 85%",
            end: "top 50%",
            scrub: true
          }
        });

        // Stagger contact cards upward
        gsap.from(".contact-card", {
          y: 60,
          opacity: 0,
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".contact-section",
            start: "top 80%",
            scrub: true
          }
        });
      } else {
        // MOBILE ONLY - Disable Pinning (Normal Vertical Flow)
        gsap.from(".contact-section", {
          opacity: 0, y: 50, duration: 0.8,
          scrollTrigger: { trigger: ".contact-section", start: "top 85%" }
        });
        gsap.from(".contact-card", {
          opacity: 0, y: 30, duration: 0.6, stagger: 0.1,
          scrollTrigger: { trigger: ".contact-section", start: "top 80%" }
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="contact-section">
      <style dangerouslySetInnerHTML={{__html: `
        .contact-section {
          position: relative;
          min-height: 80vh;
          background: linear-gradient(135deg, #F97316, #E65100);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 40px;
          z-index: 10;
          overflow: visible;
        }

        .contact-heading {
          font-family: 'Bungee', sans-serif !important;
          color: #7C2D12 !important;
          font-size: clamp(2rem, 6vw, 4.5rem);
          font-weight: 800;
          letter-spacing: 4px;
          text-align: center;
          text-transform: uppercase;
          margin-bottom: 48px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
          align-items: stretch;
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          justify-content: center;
        }

        .contact-card {
          padding: 24px 28px;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          height: 100%;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
          margin: 0;
          transform: none;
        }

        .contact-card::before {
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

        .contact-card:hover::before {
          height: 100%;
          opacity: 1;
        }

        .contact-card:hover {
          transform: translateX(5px);
          
        }

        .contact-card-label {
          font-family: 'Inter', sans-serif !important;
          font-size: 0.7rem;
          letter-spacing: 3px;
          color: rgba(255, 255, 255, 0.7) !important;
          text-transform: uppercase;
        }

        .contact-card-value {
          font-family: 'Inter', sans-serif !important;
          font-size: 1.05rem;
          color: #FFFFFF !important;
          word-break: break-all;
        }

        .contact-card-icon {
          font-size: 1.4rem;
          margin-bottom: 4px;
          opacity: 0.9;
          color: #FFFFFF;
        }

        .contact-footer {
          margin-top: 64px;
          width: 100%;
          max-width: 900px;
          margin-top: 100px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #222;
          padding-top: 24px;
          font-family: 'Inter', sans-serif !important;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.5) !important;
        }

        @media (max-width: 768px) {
          .contact-section {
            padding: 60px 20px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-heading {
            font-size: clamp(2rem, 7vw, 3.5rem);
            letter-spacing: 3px;
            margin-bottom: 20px;
          }

          .contact-footer {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
        }
      `}} />

      <h2 className="contact-heading">CONTACT</h2>

      <div className="contact-grid">

        {/* LEFT COLUMN: Email + Phone */}
        <a href="mailto:akashad23072002@gmail.com" className="contact-card">
          <span className="contact-card-icon">✉</span>
          <span className="contact-card-label">Email</span>
          <span className="contact-card-value">akashad23072002@gmail.com</span>
        </a>

        <a href="https://github.com/akashad123" target="_blank" rel="noopener noreferrer" className="contact-card">
          <span className="contact-card-icon">⌥</span>
          <span className="contact-card-label">GitHub</span>
          <span className="contact-card-value">github.com/akashad123</span>
        </a>

        <a href="tel:+919072339553" className="contact-card">
          <span className="contact-card-icon">✆</span>
          <span className="contact-card-label">Phone</span>
          <span className="contact-card-value">+91 9072339553</span>
        </a>

        <a href="https://www.linkedin.com/in/akash-ad-1734a527a/" target="_blank" rel="noopener noreferrer" className="contact-card">
          <span className="contact-card-icon">↗</span>
          <span className="contact-card-label">LinkedIn</span>
          <span className="contact-card-value">linkedin.com/in/akash-ad</span>
        </a>

      </div>

      <footer className="contact-footer">
        <span>© 2026 Akash AD</span>
        {/* <span style={{ opacity: 0.4 }}>Built with React + GSAP</span> */}
      </footer>

    </section>
  );
};

export default Contact;
