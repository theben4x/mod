import Link from "next/link";
import Image from "next/image";

/**
 * לוגו tested — קובץ מותג מלא (סמל המגן + הוורדמרק "tested").
 * הסמל תמיד משמאל והטקסט מימין; dir="ltr" מונע היפוך ב-RTL.
 * שתי גרסאות: כהה-על-בהיר למצב יום, ובהיר-על-כהה למצב לילה (ברירת המחדל),
 * עם רקע שקוף כדי שלא יופיע ריבוע לבן. unoptimized = פיקסלים מדויקים אחד-לאחד.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      dir="ltr"
      className={`group inline-flex items-center transition-opacity duration-200 hover:opacity-80 ${className}`}
      aria-label="tested — דף הבית"
    >
      {/* מצב יום — דיו כהה */}
      <Image
        src="/logo-tested.png"
        alt="tested"
        width={2234}
        height={763}
        priority
        unoptimized
        className="block h-8 w-auto dark:hidden"
      />
      {/* מצב לילה — דיו בהיר */}
      <Image
        src="/logo-tested-dark.png"
        alt="tested"
        width={2234}
        height={763}
        priority
        unoptimized
        className="hidden h-8 w-auto dark:block"
      />
    </Link>
  );
}
