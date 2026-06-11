type BarState = "win" | "lose" | "tie" | "neutral";

const COLORS: Record<BarState, string> = {
  win: "bg-accent",
  lose: "bg-muted/35",
  tie: "bg-foreground/35",
  neutral: "bg-foreground/25",
};

/**
 * בר ויזואלי לערך מפרט.
 * align="start" → הבר מתמלא מצד ההתחלה הלוגי (ימין ב-RTL),
 * align="end" → מצד הסיום (שמאל ב-RTL). מתאים ליישור הערך בתא.
 */
export function SpecBar({ ratio, align, state }: { ratio: number; align: "start" | "end"; state: BarState }) {
  const pct = Math.max(3, Math.min(100, ratio * 100));
  return (
    <div className={`flex h-1.5 w-full overflow-hidden rounded-full bg-border/50 ${align === "start" ? "justify-start" : "justify-end"}`}>
      <div
        className={`h-full rounded-full animate-grow-x ${COLORS[state]}`}
        style={{ width: `${pct}%`, transformOrigin: align === "start" ? "right" : "left" }}
      />
    </div>
  );
}
