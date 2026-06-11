import Link from "next/link";
import { Logo } from "./Logo";
import { FOOTER_CATEGORIES, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface/50 sm:mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          <div className="col-span-2 space-y-4 lg:col-span-1">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">{SITE.tagline} השוואת רכיבי חומרה זה מול זה, עם מפרט מלא ומחירים מעודכנים.</p>
          </div>

          <div>
            <h3 className="mono mb-4 text-[11px] uppercase tracking-wider text-muted">קטגוריות</h3>
            <ul className="space-y-2.5 text-sm">
              {FOOTER_CATEGORIES.map((c) => (
                <li key={c.key}>
                  <Link href={c.href} className="text-foreground/80 transition-colors hover:text-accent">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mono mb-4 text-[11px] uppercase tracking-wider text-muted">ניווט</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/compare" className="text-foreground/80 transition-colors hover:text-accent">השוואה</Link></li>
              <li><Link href="/compatibility" className="text-foreground/80 transition-colors hover:text-accent">בדיקת תאימות</Link></li>
              <li><Link href="/blog" className="text-foreground/80 transition-colors hover:text-accent">בלוג</Link></li>
              <li><Link href="/about" className="text-foreground/80 transition-colors hover:text-accent">אודות</Link></li>
              <li><Link href="/credits" className="text-foreground/80 transition-colors hover:text-accent">קרדיטים לתמונות</Link></li>
              <li><Link href="/accessibility" className="text-foreground/80 transition-colors hover:text-accent">הצהרת נגישות</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h3 className="mono mb-4 text-[11px] uppercase tracking-wider text-muted">על האתר</h3>
            <p className="text-sm leading-relaxed text-muted">
              המחירים והמפרטים מובאים לצורכי השוואה בלבד וייתכנו שינויים. בדקו תמיד מול החנות לפני רכישה.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted sm:flex-row">
          <p className="mono">© {new Date().getFullYear()} tested · כל הזכויות שמורות</p>
          <p>נבנה בקפידה למאהבי חומרה 🇮🇱</p>
        </div>
      </div>
    </footer>
  );
}
