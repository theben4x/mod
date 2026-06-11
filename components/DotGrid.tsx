/** רקע נקודות (dot grid) קבוע עם דהייה רכה לקצוות. מאחורי כל התוכן. */
export function DotGrid() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="dot-grid grid-fade absolute inset-0" />
      {/* זוהר accent עדין בראש העמוד */}
      <div
        className="absolute inset-x-0 -top-40 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 100% at 50% 0%, hsl(var(--accent) / 0.10), transparent 70%)",
        }}
      />
    </div>
  );
}
