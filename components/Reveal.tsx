"use client";

import { useEffect, useRef } from "react";

/**
 * חושף את הילדים באנימציית fade-up עדינה כשהם נכנסים לתצוגה.
 * הילדים מרונדרים גלויים ב-SSR (בטוח ל-SEO/ללא-JS); האנימציה היא one-shot
 * דרך Web Animations API, ולכן אין מצב "מוסתר" קבוע ואין הבהוב.
 * מכבד prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window) || !el.animate) return;

    let played = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played) {
            played = true;
            el.animate(
              [
                { opacity: 0, transform: "translateY(14px)" },
                { opacity: 1, transform: "translateY(0)" },
              ],
              { duration: 600, delay, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" },
            );
            io.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
