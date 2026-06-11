"use client";

import { usePrefs } from "./Providers";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = usePrefs();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "מעבר למצב בהיר" : "מעבר למצב כהה"}
      title={theme === "dark" ? "מצב בהיר" : "מצב כהה"}
      className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-foreground transition-colors duration-200 hover:bg-accent-soft hover:text-accent"
    >
      {mounted && theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
