"use client";

import { useState } from "react";
import { CheckIcon, ShareIcon } from "./icons";

export function ShareButton({ title }: { title?: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: title ?? "tested", url });
        return;
      } catch {
        /* בוטל ע"י המשתמש — ניפול להעתקה */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* אין הרשאת clipboard */
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-sm text-foreground transition-colors hover:bg-accent-soft hover:text-accent"
    >
      {copied ? <CheckIcon width={15} height={15} className="text-win" /> : <ShareIcon width={15} height={15} />}
      {copied ? "הקישור הועתק" : "שתף השוואה"}
    </button>
  );
}
