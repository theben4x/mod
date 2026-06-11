"use client";

import { useEffect, useRef, useState } from "react";

/**
 * אפקט הקלדה (typewriter) עם סמן מהבהב, בלולאה.
 * ב-SSR מוצג הטקסט המלא (יציב/נגיש); ההקלדה מתחילה כשהאלמנט נכנס לתצוגה.
 * מכבד prefers-reduced-motion (מציג טקסט מלא ללא אנימציה).
 */
export function Typewriter({
  text,
  className,
  speed = 95,
  pause = 1800,
  startDelay = 0,
  cursorClassName = "text-accent",
}: {
  text: string;
  className?: string;
  speed?: number;
  pause?: number;
  startDelay?: number;
  cursorClassName?: string;
}) {
  const [display, setDisplay] = useState(text);
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // הפעלה כשנכנס לתצוגה (ואם נתמך + ללא reduced-motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setAnimate(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setAnimate(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!animate) return;
    let cancelled = false;
    let i = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      if (!deleting) {
        i++;
        setDisplay(text.slice(0, i));
        if (i >= text.length) {
          deleting = true;
          timer = setTimeout(tick, pause);
          return;
        }
        timer = setTimeout(tick, speed);
      } else {
        i--;
        setDisplay(text.slice(0, i));
        if (i <= 0) {
          deleting = false;
          timer = setTimeout(tick, speed * 3);
          return;
        }
        timer = setTimeout(tick, speed * 0.55);
      }
    };

    setDisplay("");
    timer = setTimeout(tick, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [animate, text, speed, pause, startDelay]);

  return (
    <span ref={ref} className={className}>
      {display}
      {animate && (
        <span aria-hidden className={`tw-caret ${cursorClassName}`}>
          |
        </span>
      )}
    </span>
  );
}
