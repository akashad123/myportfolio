import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Frame sources ──────────────────────────────────────────────────────────
const moduleFrames = import.meta.glob('../assets/hero/*.{jpg,png}', { eager: true });
const FRAME_SRCS = Object.keys(moduleFrames).sort().map(k => moduleFrames[k].default);

// ─────────────────────────────────────────────────────────────────────────────
//  TextPressure — interactive letter-distortion on hover
//
//  · Text is split into individual <span> letters on mount
//  · mousemove computes distance from cursor to each letter's centre
//  · proximity (0–1) drives scaleY/scaleX/translateY via DIRECT DOM write
//  · NO useState during hover → zero React re-renders → 60fps smooth
//  · mouseleave resets all transforms
//
//  Bebas Neue is single-weight — font-weight variation is skipped.
//  The 3-axis transform creates a convincing pressure distortion instead.
// ─────────────────────────────────────────────────────────────────────────────

const TextPressure = ({ text }) => {
  const wrapRef = useRef(null);

  const onMove = (e) => {
    const chars = wrapRef.current?.querySelectorAll('.tp-ch');
    if (!chars) return;
    chars.forEach((el) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      const p = Math.max(0, 1 - d / 160);   // wider falloff radius = gentler wave
      const sy = 1 + p * 0.18;               // max +18% vertical (was 55% — too big)
      const sx = 1 - p * 0.04;               // max -4% horizontal squeeze (was 10%)
      const ty = -p * 3;                     // 3px lift (was 10px)
      el.style.transform = `scaleX(${sx}) scaleY(${sy}) translateY(${ty}px)`;
      el.style.textShadow = p > 0.05
        ? `0 ${2 + p * 8}px ${12 + p * 24}px rgba(0,0,0,${0.35 + p * 0.2})`
        : '';
    });
  };

  const onLeave = () => {
    wrapRef.current?.querySelectorAll('.tp-ch').forEach((el) => {
      el.style.transform = '';
      el.style.textShadow = '';
    });
  };

  return (
    <span
      ref={wrapRef}
      style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'middle' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="tp-ch"
          style={{
            display: 'inline-block',
            transition: 'transform 0.09s ease-out, text-shadow 0.09s ease-out',
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  HERO — Full-screen canvas background, text overlaid
//
//  Layout     : canvas fills 100vw × 100vh (no split, no background color)
//  Text       : absolutely positioned on right, vertically centered, z:10
//  Background : pure #000 fallback while frame 0 loads
//  Entry anim : name fades → role slides up → tag appears
//  Scroll anim: frames 0→239 pinned, canvas exits with scale+blur
// ─────────────────────────────────────────────────────────────────────────────

const Hero = () => {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);
  const roleRef = useRef(null);   // "FRONTEND DEVELOPER"
  const overlayRef = useRef(null);   // orange exit overlay (#F97316)
  const navRef = useRef(null);   // "AKASH AD" navbar

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const images = new Array(FRAME_SRCS.length).fill(null);
    const obj = { frame: 0 };

    // ── DPR-correct sizing (full-screen canvas) ─────────────────────────────
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.offsetWidth * dpr);
      canvas.height = Math.round(canvas.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);          // reset + scale in one call
    };
    setSize();

    // ── Draw: object-fit:cover equivalent, top-anchor ───────────────────────
    //    Fills the full canvas — same as video { object-fit: cover }
    const drawFrame = (rawIdx) => {
      const img = images[Math.round(rawIdx)];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(
        img,
        (cw - img.naturalWidth * s) / 2,   // center horizontally
        0,                                    // top-anchor — head never shifts
        img.naturalWidth * s,
        img.naturalHeight * s,
      );
    };

    // ── Preload all frames ───────────────────────────────────────────────────
    FRAME_SRCS.forEach((src, i) => {
      const img = new Image();
      img.onload = () => { images[i] = img; if (i === 0) drawFrame(0); };
      img.src = src;
    });

    const onResize = () => { setSize(); drawFrame(obj.frame); };
    window.addEventListener('resize', onResize);

    // ══════════════════════════════════════════════════════════════════════
    //  INITIAL STATES — lock before first paint, zero layout shift
    // ══════════════════════════════════════════════════════════════════════

    gsap.set(canvas, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transformOrigin: 'center center',   // full-screen: scale from true center
      willChange: 'transform, opacity, filter',
    });

    gsap.set(heroRef.current, { opacity: 1 });

    // Orange exit overlay — starts fully transparent, rises at end of scroll
    // Matches Story section background exactly → zero-colour-break transition
    gsap.set(overlayRef.current, { opacity: 0 });

    // ══════════════════════════════════════════════════════════════════════
    //  INITIAL STATES
    //  name  : fully visible (opacity 1) — user sees it on page load
    //  role  : hidden (opacity 0) — scroll will reveal it
    //  y = 0 for both — no positional offset, only opacity transitions
    // ══════════════════════════════════════════════════════════════════════

    // "FRONTEND DEVELOPER" — hidden, scroll will reveal it
    gsap.set(roleRef.current, {
      opacity: 0,
      y: 0,
      willChange: 'opacity',
    });

    // ══════════════════════════════════════════════════════════════════════
    //  SCROLL TIMELINE — pinned, frame animation + cinematic exit
    // ══════════════════════════════════════════════════════════════════════

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      },
    });

    // Frame playback across full scroll
    scrollTl.to(obj, {
      frame: FRAME_SRCS.length - 1,
      ease: 'none',
      duration: 8,
      onUpdate: () => drawFrame(obj.frame),
    }, 0);

    // FRONTEND DEVELOPER — fades in after scroll begins
    scrollTl.to(roleRef.current, {
      opacity: 1,
      ease: 'none',
      duration: 1.6,
      immediateRender: false,
    }, 1.2);

    // ══════════════════════════════════════════════════════════════════════
    //  EXIT — Two strict phases to guarantee zero dark bleed
    //
    //  PHASE 1 [6.0 → 7.5]  Orange curtain closes FIRST
    //    · overlay rises  opacity 0 → 1   (z-index 15, above everything)
    //    · role text fades opacity 1 → 0  (gone before orange is solid)
    //    → At position 7.5 the screen is 100% solid orange. Nothing beneath visible.
    //
    //  PHASE 2 [7.5 → 9.0]  Canvas fades behind closed curtain
    //    · canvas fades opacity 1 → 0   (user can't see this — orange already solid)
    //    · no scale, no blur — eliminates blur-bleed artifacts at canvas edges
    //    → Clean, simple, bulletproof
    //
    //  KEY INSIGHT: dark image pixels CANNOT bleed through once the overlay is
    //  fully opaque. Running overlay and canvas simultaneously at equal opacity
    //  means dark pixels show THROUGH the semi-transparent orange. Sequencing
    //  them eliminates this entirely.
    // ══════════════════════════════════════════════════════════════════════

    // ── PHASE 1a: all text (heading & navbar) fades out as orange rises ─────
    scrollTl.to([roleRef.current, navRef.current], {
      opacity: 0,
      duration: 1.2,
      ease: 'none',
      immediateRender: false,
    }, 6.0);

    // ── PHASE 1b: orange overlay rises to full opacity ──────────────────────
    //  MUST complete before canvas fades — this is the strict ordering rule
    scrollTl.to(overlayRef.current, {
      opacity: 1,
      duration: 1.5,   // 6.0 → 7.5 : orange fully solid at position 7.5
      ease: 'none',
      immediateRender: false,
    }, 6.0);

    // ── PHASE 2: canvas fades under the already-opaque orange curtain ───────
    //  No scale, no blur — removes edge-bleed artifacts from blur filter
    //  User sees nothing here (solid orange is above), but cleanup is correct
    scrollTl.to(canvas, {
      opacity: 0,
      duration: 1.5,   // 7.5 → 9.0
      ease: 'none',
      immediateRender: false,
    }, 7.5);



    return () => {
      window.removeEventListener('resize', onResize);
      scrollTl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Akash AD — Frontend Developer"
      className="relative w-full overflow-hidden"
      style={{
        height: '100vh',
        background: '#F97316',    // no #000 — overlay handles the exit colour
        transformOrigin: 'center center',
        marginBottom: 0,
      }}
    >

      {/* ──────────────────────────────────────────────────────────
          FULL-SCREEN CANVAS — covers entire hero, z-index: 0
          Draws frames at object-fit:cover scale, top-anchored
          ────────────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute top-0 left-0 block"
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      />

      {/* ORANGE EXIT OVERLAY
          · z-index 15 → above text panel (z:10) and canvas (z:0)
          · #F97316 matches Story section bg exactly = zero colour break
          · starts opacity:0, GSAP animates to 1 during scroll exit */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: '#F97316', zIndex: 15, opacity: 0 }}
      />

      {/* ── TRANSPARENT NAVBAR — top of hero, z-index 30 (above overlay at z:15) ──
          Absolute inside the pinned section so it scrolls with the pin.
          "AKASH AD" branding top-right. No background, fully transparent. */}
      <nav
        ref={navRef}
        aria-label="Site navigation"
        className="absolute top-0 left-0 right-0 flex items-center justify-end"
        style={{
          padding: 'clamp(20px, 3vh, 36px) clamp(24px, 4vw, 56px)',
          zIndex: 30,
          background: 'transparent',
          pointerEvents: 'none',   // let canvas interactions pass through
        }}
      >
        <span
          className="transition-opacity duration-200"
          style={{
            fontFamily:    "'Inter', sans-serif",
            fontSize:      'clamp(12px, 1vw, 15px)',
            fontWeight:    800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textShadow:    '0 0 10px rgba(255,255,255,0.2)',
            color:         '#ffffff',
            opacity:       0.95,
          }}
        >
          Akash&nbsp;AD
        </span>
      </nav>

      {/* ── "FRONTEND DEVELOPER" — bottom-anchored full-width editorial headline ── */}
      <div
        className="absolute flex flex-col items-center justify-end"
        style={{
          bottom: 'clamp(48px, 8vh, 100px)',
          left: 0,
          right: 0,
          paddingLeft: 'clamp(24px, 4vw, 64px)',
          paddingRight: 'clamp(24px, 4vw, 64px)',
          zIndex: 20,
          textAlign: 'center',
        }}
      >

        {/*
          "FRONTEND DEVELOPER" — full-width editorial headline
          Single line, no break, spans the viewport width
          Bebas Neue at poster scale — editorial / MARIN MARTIN style
          -webkit-text-stroke adds perceived weight to the 400-only font
        */}
        <h1
          ref={roleRef}
          className="m-0 text-[clamp(60px,8.5vw,150px)] leading-[0.85] whitespace-nowrap max-sm:text-[clamp(40px,12vw,60px)] max-sm:leading-tight max-sm:text-center max-sm:px-4"
          style={{
            fontFamily:      "'Bebas Neue', sans-serif",
            fontWeight:      600,
            letterSpacing:   '-2px',
            color:           '#FFFFFF',
            textTransform:   'uppercase',
            cursor:          'default',
            // ── Vertical stretch: makes characters taller without changing width ──
            // GSAP only animates 'opacity' on roleRef — no transform conflict
            transform:       'scaleY(1.22)',
            transformOrigin: 'center bottom',            // grows upward
          }}
        >
          <span className="max-sm:block sm:inline-block"><TextPressure text="FRONTEND" /></span>
          <span className="max-sm:hidden">&nbsp;</span>
          <span className="max-sm:block sm:inline-block"><TextPressure text="DEVELOPER" /></span>
        </h1>




      </div>

    </section>
  );
};

export default Hero;
