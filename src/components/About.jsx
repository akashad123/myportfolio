import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Content ────────────────────────────────────────────────────────────────
const LINE_1 =
  "I'm a passionate React Front-End Developer with one year of professional experience at Stratagile Pvt Ltd, currently pursuing my MCA at Lead College, Palakkad.";
const LINE_2 =
  "My journey in web development began with a Bachelor's in Computer Science from the University of Calicut, and has evolved into a specialization in creating dynamic, user-centric applications using modern technologies.";

// ── Helper: split a string into individual word <span> elements ─────────────
// Each .word span is a GSAP target for the word-by-word stagger
const WordSplit = ({ text }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span
        key={i}
        className="word"
        style={{ display: "inline-block", marginRight: "0.28em" }}
      >
        {word}
      </span>
    ))}
  </>
);

// ─────────────────────────────────────────────────────────────────────────────
//  ANIMATION MODEL — word-by-word scroll-scrubbed reveal
//
//  [0.0 – 1.0]  heading        : opacity 0→1, y 50→0
//  [0.7 – 2.5]  ~50 words      : opacity 0→1, y 40→0, stagger 0.035
//  [2.5 – 4.0]  HOLD           : everything fully readable
//  [4.0 – 5.0]  EXIT           : all elements y→-70, opacity→0
//
//  section pinned for end: +=200% (scroll room = 2×viewport height)
//  scrub: true — every value perfectly tied to scroll position
// ─────────────────────────────────────────────────────────────────────────────

const About = () => {
  const storyRef = useRef(null);
  const headRef  = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Collect all word spans ────────────────────────────────────────────
      const words = storyRef.current.querySelectorAll(".word");

      // ── Initial states — invisible before scroll reaches this section ─────
      gsap.set(headRef.current, {
        opacity:    0,
        y:          50,
        willChange: "transform, opacity",
      });
      gsap.set(words, {
        opacity:    0,
        y:          40,
        willChange: "transform, opacity",
      });

      // ── Pinned scroll timeline ────────────────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       storyRef.current,
          start:         "top top",
          end:           "+=200%",
          scrub:         true,
          pin:           true,
          pinSpacing:    true,
          anticipatePin: 1,
        },
      });

      // Heading enters first
      tl.to(headRef.current, {
        opacity:  1,
        y:        0,
        duration: 1,
        ease:     "none",
      }, 0);

      // Words reveal one-by-one — stagger creates the cinematic wave
      tl.to(words, {
        opacity:  1,
        y:        0,
        stagger:  0.035,  // ~50 words × 0.035 = ~1.75 total duration
        duration: 0.8,
        ease:     "none",
      }, 0.7);

      // Hold — user reads without anything moving
      tl.to({}, { duration: 1.5 }, 3.0);

      // Exit — heading and all words slide up and out
      tl.to([headRef.current, ...Array.from(words)], {
        y:               -70,
        opacity:         0,
        stagger:         0.008,
        duration:        1,
        ease:            "none",
        immediateRender: false,
      }, 4.5);

    }, storyRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={storyRef}
        className="h-[200vh] relative"
        style={{
          // ── 1. PREMIUM GRADIENT background ─────────────────────────────
          // #F97316 → #EA580C → #C2410C: warm orange progression
          // Matches hero exit overlay exactly at the top, deepens downward
          background: "linear-gradient(145deg, #F97316 0%, #EA580C 55%, #C2410C 100%)",
          overflow: "hidden",
        }}
      >

        {/* ── 2. RADIAL GLOW — soft white center light, z:1 ──────────────
            Creates a subtle "studio light" depth effect.
            Transparent at edges so gradient shows through cleanly. */}
        <div
          aria-hidden="true"
          style={{
            position:       "absolute",
            inset:          0,
            background:     "radial-gradient(ellipse 75% 55% at 50% 35%, rgba(255,255,255,0.13) 0%, transparent 70%)",
            pointerEvents:  "none",
            zIndex:         1,
          }}
        />

        {/* ── 3. BACKGROUND WATERMARK — large faded "STORY" ────────────────
            Bebas Neue, opacity 0.05 — barely perceptible depth layer.
            Centered behind all content, user-select none to prevent highlight. */}
        <div
          aria-hidden="true"
          style={{
            position:       "absolute",
            inset:          0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
            pointerEvents:  "none",
            zIndex:         1,
            overflow:       "hidden",
          }}
        >
          <span
            style={{
              fontFamily:  "'Bebas Neue', sans-serif",
              fontSize:    "clamp(140px, 22vw, 380px)",
              fontWeight:  400,
              color:       "rgba(255,255,255,0.05)",
              letterSpacing: "0.08em",
              lineHeight:  1,
              userSelect:  "none",
              whiteSpace:  "nowrap",
            }}
          >
            STORY
          </span>
        </div>

        {/* ── 4. TOP TRANSITION SHAPE — connects hero → story ──────────────
            Radial gradient at top edge: semi-transparent orange fading out.
            Makes the boundary between hero and about invisible. */}
        <div
          aria-hidden="true"
          style={{
            position:       "absolute",
            top:            0,
            left:           0,
            right:          0,
            height:         "120px",
            background:     "linear-gradient(to bottom, rgba(249,115,22,0.7) 0%, transparent 100%)",
            pointerEvents:  "none",
            zIndex:         2,
          }}
        />

        {/* ── PINNED CONTENT — sticky inner panel ──────────────────────── */}
        <div
          className="sticky top-0 h-screen"
          style={{ zIndex: 10 }}
        >
          {/* ── 5. ASYMMETRIC GRID — responsive (stack on mobile, split on desktop) ── */}
          <div
            className="flex flex-col justify-center items-start md:grid md:items-center h-full"
            style={{
              gridTemplateColumns: "2fr 5fr",
              gap:                 "clamp(24px, 5vw, 80px)",
              padding:             "clamp(32px, 8vh, 100px) clamp(24px, 7vw, 120px)",
            }}
          >

            {/* LEFT COLUMN — STORY heading ──────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <h2
                ref={headRef}
                className="story-heading !text-[var(--color-orange-deep)]"
                style={{
                  fontFamily:    "'Bebas Neue', sans-serif",
                  fontSize:      "clamp(2rem, 6vw, 4.5rem)",
                  letterSpacing: "8px",
                  textTransform: "uppercase",
                  lineHeight:    0.95,
                  // inline color removed, driven firmly by Tailwind ! class
                  fontWeight:    400,
                  margin:        0,
                }}
              >
                Story
              </h2>

              {/* Accent bar below heading — minimal editorial detail */}
              <div
                style={{
                  width:        "clamp(36px, 5vw, 64px)",
                  height:       "3px",
                  background:   "var(--color-orange-deep)", // Matches heading color natively
                  opacity:      0.6,
                  marginTop:    "clamp(12px, 1.5vh, 20px)",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* RIGHT COLUMN — raw text layout, container styling removed ─────────── */}
            {/* Kept the identical padding so the text layout/spacing does not shift at all */}
            <div
              style={{
                padding: "clamp(28px, 4vh, 52px) clamp(28px, 4vw, 52px)",
              }}
            >
              <p
                className="story-text !text-[var(--color-orange-deep)]"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   "clamp(15px, 1.5vw, 19px)",
                  fontWeight: 400,
                  lineHeight: 1.85,
                  margin:     0,
                }}
              >
                {/* LINE 1 — words animate individually */}
                <span style={{ display: "block", marginBottom: "1.1em" }}>
                  <WordSplit text={LINE_1} />
                </span>

                {/* LINE 2 — words animate individually, staggered after line 1 */}
                <span style={{ display: "block" }}>
                  <WordSplit text={LINE_2} />
                </span>
              </p>
            </div>

          </div>
        </div>

      </section>
    </>
  );
};

export default About;
