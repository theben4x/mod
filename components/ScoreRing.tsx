/**
 * טבעת ציון 0–100 — גרף רדיאלי קומפקטי.
 * SVG טהור (ללא state) כדי שיעבוד גם בקומפוננטות שרת.
 * הצבע יורש מ-currentColor של ה-accent דרך משתנה ה-CSS.
 */
export function ScoreRing({
  score,
  size = 38,
  label,
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const stroke = 3;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, score));
  const dash = (clamped / 100) * circumference;

  return (
    <span
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
      title={label ? `${label}: ${score}` : undefined}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
      <span className="mono absolute text-[11px] font-semibold tabular-nums leading-none">{score}</span>
    </span>
  );
}
