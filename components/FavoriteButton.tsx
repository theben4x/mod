"use client";

import { usePrefs } from "./Providers";
import { HeartIcon } from "./icons";

export function FavoriteButton({ id, name }: { id: string; name: string }) {
  const { isFavorite, toggleFavorite } = usePrefs();
  const active = isFavorite(id);
  return (
    <button
      type="button"
      onClick={() => toggleFavorite(id)}
      aria-pressed={active}
      aria-label={active ? `הסר את ${name} מהמועדפים` : `הוסף את ${name} למועדפים`}
      title={active ? "במועדפים" : "הוסף למועדפים"}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-muted hover:border-accent hover:text-accent"
      }`}
    >
      <HeartIcon filled={active} width={14} height={14} />
      {active ? "במועדפים" : "שמירה למועדפים"}
    </button>
  );
}
