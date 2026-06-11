"use client";

import Link from "next/link";
import type { Component } from "@/lib/types";
import { getComponent } from "@/lib/data";
import { getCategory } from "@/data/categories";
import { usePrefs } from "./Providers";
import { CategoryIcon } from "./CategoryIcon";
import { ComponentImageView } from "./ComponentImageView";
import { HeartIcon } from "./icons";

function resolve(ids: string[]): Component[] {
  return ids.map((id) => getComponent(id)).filter((c): c is Component => Boolean(c));
}

export function FavoritesView({ images = {} }: { images?: Record<string, string | null> }) {
  const { favorites, recent, toggleFavorite, mounted } = usePrefs();
  if (!mounted) return <div className="py-16 text-center text-sm text-muted">טוען…</div>;

  const favComps = resolve(favorites);
  const recentComps = resolve(recent).filter((c) => !favorites.includes(c.id));

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-lg font-semibold tracking-tight">
          מועדפים <span className="mono text-muted">({favComps.length})</span>
        </h2>
        {favComps.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-border py-12 text-center text-sm text-muted">
            עוד לא שמרתם רכיבים. לחצו על «שמירה למועדפים» בעמוד של כל רכיב.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favComps.map((c) => (
              <FavCard key={c.id} c={c} imageSrc={images[c.id] ?? null} onRemove={() => toggleFavorite(c.id)} />
            ))}
          </div>
        )}
      </section>

      {recentComps.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold tracking-tight">נצפו לאחרונה</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentComps.map((c) => (
              <FavCard key={c.id} c={c} imageSrc={images[c.id] ?? null} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FavCard({ c, imageSrc, onRemove }: { c: Component; imageSrc: string | null; onRemove?: () => void }) {
  const cat = getCategory(c.category);
  return (
    <div className="card group relative flex flex-col gap-2 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card">
      <Link href={`/component/${c.id}`} className="absolute inset-0 z-[1] rounded-2xl" aria-label={c.name} />
      <ComponentImageView
        component={c}
        src={imageSrc}
        className="relative z-0 h-24 w-full"
        sizes="(max-width: 640px) 100vw, 240px"
        iconSize={40}
      />
      <div className="relative z-0 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <span className="mono text-[10px] uppercase tracking-wide text-muted">{c.brand}</span>
          <h3 className="ltr truncate text-sm font-semibold leading-tight">{c.name}</h3>
        </div>
        {typeof c.score === "number" && (
          <span className="mono shrink-0 rounded-lg bg-accent-soft px-2 py-1 text-xs font-semibold text-accent">{c.score}</span>
        )}
      </div>
      <div className="relative z-0 mt-auto flex items-center gap-1.5 pt-1 text-xs text-muted">
        {cat && <CategoryIcon category={cat.key} width={13} height={13} />}
        {cat?.nameHe}
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`הסר את ${c.name} מהמועדפים`}
          title="הסר מהמועדפים"
          className="absolute end-2 bottom-2 z-[2] grid h-7 w-7 place-items-center rounded-lg border border-accent bg-accent-soft text-accent transition-colors hover:brightness-105"
        >
          <HeartIcon filled width={13} height={13} />
        </button>
      )}
    </div>
  );
}
