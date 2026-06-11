import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <span className="mono text-6xl font-bold text-accent sm:text-7xl">404</span>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">העמוד לא נמצא</h1>
      <p className="mt-3 text-muted">ייתכן שההשוואה או הדף שחיפשתם הוסרו, או שהקישור שגוי.</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-all hover:brightness-110"
        >
          חזרה לדף הבית
        </Link>
        <Link
          href="/compare"
          className="rounded-xl border border-border bg-surface px-5 py-3 text-sm transition-colors hover:bg-accent-soft hover:text-accent"
        >
          התחילו השוואה
        </Link>
      </div>
    </div>
  );
}
