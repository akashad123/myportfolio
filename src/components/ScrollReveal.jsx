import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollReveal.css";

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  baseOpacity = 0.2,
  enableBlur = true,
  baseRotation = 2,
  blurStrength = 6,
  containerClassName = "",
  textClassName = "",
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll(".word");

    gsap.set(words, {
      opacity: baseOpacity,
      rotation: baseRotation,
      filter: enableBlur ? `blur(${blurStrength}px)` : "none",
      y: 20,
    });

    gsap.to(words, {
      opacity: 1,
      rotation: 0,
      filter: "blur(0px)",
      y: 0,
      duration: 1,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === el) trigger.kill();
      });
    };
  }, [baseOpacity, enableBlur, baseRotation, blurStrength]);

  const wordsArray = typeof children === "string" ? children.split(" ") : [];

  return (
    <div ref={containerRef} className={containerClassName}>
      <p className={`scroll-reveal-text ${textClassName}`}>
        {wordsArray.map((word, index) => (
          <span key={index} className="word">
            {word}&nbsp;
          </span>
        ))}
      </p>
    </div>
  );
};

export default ScrollReveal;
