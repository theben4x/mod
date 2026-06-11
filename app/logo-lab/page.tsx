import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Logo Lab",
  robots: { index: false, follow: false },
};

// ── 6 קונספטים מופשטים (ללא אות). כל מארק מקבל size + uid (ids ייחודיים). ──
const GREEN = "#18A06E";
const INDIGO = "#6063EE";

// 1 · Versus — שני שברונים פונים זה לזה
function VersusMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M7 8 L14 16 L7 24" stroke={GREEN} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 8 L18 16 L25 24" stroke={INDIGO} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 2 · Overlap — שני ריבועים חופפים (מיזוג/השוואה)
function OverlapMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="4.5" y="7" width="15" height="15" rx="4.5" fill={GREEN} />
      <rect x="12.5" y="10" width="15" height="15" rx="4.5" fill={INDIGO} fillOpacity="0.88" />
    </svg>
  );
}

// 3 · Spec Bars — שני ברים בגבהים שונים
function BarsMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <rect x="7" y="15" width="7" height="12" rx="3.5" fill={GREEN} />
      <rect x="18" y="5" width="7" height="22" rx="3.5" fill={INDIGO} />
    </svg>
  );
}

// 4 · Duality — עיגול חצוי
function SplitMark({ size = 44, uid = "s" }: { size?: number; uid?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <clipPath id={`clip-${uid}`}>
          <circle cx="16" cy="16" r="12.5" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${uid})`}>
        <rect x="2" y="3" width="13" height="26" fill={GREEN} />
        <rect x="17" y="3" width="13" height="26" fill={INDIGO} />
      </g>
    </svg>
  );
}

// 5 · Radar — טבעות סריקה + נקודה (קשור לגרף הרדאר באתר)
function RadarMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="11.5" stroke={GREEN} strokeWidth="2" />
      <circle cx="16" cy="16" r="6" stroke={GREEN} strokeWidth="2" opacity="0.5" />
      <circle cx="16" cy="16" r="2.2" fill={GREEN} />
      <circle cx="24.1" cy="7.9" r="3" fill={INDIGO} />
    </svg>
  );
}

// 6 · Hexagon — משושה מצולע (רמיזת שבב/חומרה)
function HexMark({ size = 44, uid = "h" }: { size?: number; uid?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id={`g-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={GREEN} />
          <stop offset="1" stopColor={INDIGO} />
        </linearGradient>
      </defs>
      <path d="M16 3.5 L27 10 V22 L16 28.5 L5 22 V10 Z" fill={`url(#g-${uid})`} />
      <path d="M16 9 L21.8 12.4 V19.2 L16 22.6 L10.2 19.2 V12.4 Z" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" opacity="0.9" />
    </svg>
  );
}

const CONCEPTS: { key: string; name: string; desc: string; render: (size: number, uid: string) => ReactNode }[] = [
  { key: "versus", name: "1 · Versus", desc: "שני שברונים פונים זה לזה — 'X מול Y'. ישיר ומבטא השוואה.", render: (s) => <VersusMark size={s} /> },
  { key: "overlap", name: "2 · Overlap", desc: "שני ריבועים מעוגלים חופפים — מיזוג/השוואה. מודרני מאוד.", render: (s) => <OverlapMark size={s} /> },
  { key: "bars", name: "3 · Spec Bars", desc: "שני ברים בגבהים שונים — השוואת מפרט. מינימלי וטכני.", render: (s) => <BarsMark size={s} /> },
  { key: "split", name: "4 · Duality", desc: "עיגול חצוי ירוק/אינדיגו — 'זה מול זה'. נקי ומאוזן.", render: (s, u) => <SplitMark size={s} uid={u} /> },
  { key: "radar", name: "5 · Radar", desc: "טבעות סריקה + נקודה — דיוק/בדיקה. קשור לגרף הרדאר באתר.", render: (s) => <RadarMark size={s} /> },
  { key: "hex", name: "6 · Hexagon", desc: "משושה מצולע בגרדיאנט — רמיזת שבב/חומרה. סולידי ומקצועי.", render: (s, u) => <HexMark size={s} uid={u} /> },
];

function Preview({ render, idBase }: { render: (size: number, uid: string) => ReactNode; idBase: string }) {
  return (
    <>
      <div className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white p-4 text-black">
        {render(44, `${idBase}-l`)}
        <span className="flex flex-col leading-none">
          <span className="text-[19px] font-semibold tracking-tight">tested</span>
          <span className="mono text-[9px] uppercase tracking-[0.2em] text-neutral-500">compare</span>
        </span>
      </div>
      <div className="flex items-center gap-2.5 rounded-xl bg-[#0a0d12] p-4 text-white">
        {render(44, `${idBase}-d`)}
        <span className="flex flex-col leading-none">
          <span className="text-[19px] font-semibold tracking-tight">tested</span>
          <span className="mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">compare</span>
        </span>
      </div>
    </>
  );
}

export default function LogoLab() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">מעבדת לוגו</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        6 קונספטים <strong className="text-foreground">מופשטים</strong> — סמלים, לא אותיות (כמו שמותגי טכנולוגיה רציניים עושים). בצבעי המותג (ירוק + אינדיגו #6063EE),
        מוצגים עם הטקסט &quot;tested&quot; על רקע בהיר וכהה ובגדלים שונים. תגיד לי איזה מספר אהבת ואשלב אותו בלוגו, ב-favicon ובתמונות השיתוף.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CONCEPTS.map((c) => (
          <div key={c.key} className="card space-y-4 p-5">
            <div>
              <h2 className="text-base font-semibold">{c.name}</h2>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{c.desc}</p>
            </div>
            <Preview render={c.render} idBase={c.key} />
            {/* גדלים — תחושת favicon */}
            <div className="flex items-center gap-4 border-t border-border pt-4">
              {c.render(20, `${c.key}-s1`)}
              {c.render(28, `${c.key}-s2`)}
              {c.render(40, `${c.key}-s3`)}
              <span className="mono ms-auto text-[10px] text-muted">20 · 28 · 40px</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
