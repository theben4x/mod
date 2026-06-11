"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Currency, Theme } from "@/lib/types";

interface Prefs {
  theme: Theme;
  currency: Currency;
  mounted: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
  /** מזהי רכיבים מועדפים */
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  /** מזהי רכיבים שנצפו לאחרונה (חדש→ישן) */
  recent: string[];
  recordView: (id: string) => void;
}

const PrefsContext = createContext<Prefs | null>(null);

const THEME_KEY = "mod-theme";
const CURRENCY_KEY = "mod-currency";
const FAV_KEY = "mod-favorites";
const RECENT_KEY = "mod-recent";
const RECENT_MAX = 12;

function readIds(key: string): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [currency, setCurrencyState] = useState<Currency>("ILS");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  // טעינת העדפות שמורות בעלייה
  useEffect(() => {
    const storedTheme = (localStorage.getItem(THEME_KEY) as Theme | null) ?? null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme: Theme = storedTheme ?? (prefersDark ? "dark" : "light");
    setThemeState(initialTheme);

    const storedCurrency = (localStorage.getItem(CURRENCY_KEY) as Currency | null) ?? null;
    if (storedCurrency) setCurrencyState(storedCurrency);

    setFavorites(readIds(FAV_KEY));
    setRecent(readIds(RECENT_KEY));
    setMounted(true);
  }, []);

  // החלת ה-theme על <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(CURRENCY_KEY, c);
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrencyState((prev) => {
      const next = prev === "ILS" ? "USD" : "ILS";
      localStorage.setItem(CURRENCY_KEY, next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  const recordView = useCallback((id: string) => {
    setRecent((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, RECENT_MAX);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<Prefs>(
    () => ({
      theme,
      currency,
      mounted,
      setTheme,
      toggleTheme,
      setCurrency,
      toggleCurrency,
      favorites,
      isFavorite,
      toggleFavorite,
      recent,
      recordView,
    }),
    [theme, currency, mounted, setTheme, toggleTheme, setCurrency, toggleCurrency, favorites, isFavorite, toggleFavorite, recent, recordView],
  );

  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): Prefs {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used within Providers");
  return ctx;
}
