"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ספירת מספרים עולה כשהאלמנט נכנס למסך.
 * SSR / ללא-JS / צביעה ראשונה מציגים את הערך האמיתי (לא 0); האנימציה היא שיפור הדרגתי בלבד.
 * מכבד prefers-reduced-motion.
 */
export function CountUp({ value, durationMs = 1100, className }: { value: number; durationMs?: number; className?: string }) {
  const [display, setDisplay] = useState(value); // ערך אמיתי ב-SSR / ללא-JS
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    started.current = false; // מאפשר אנימציה מחדש אם value השתנה
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            setDisplay(0); // איפוס רק ברגע תחילת האנימציה
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / durationMs);
              const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
              setDisplay(Math.round(value * eased));
              if (t < 1) raf = requestAnimationFrame(tick);
            };
            raf = requestAnimationFrame(tick);
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("he-IL")}
    </span>
  );
}
