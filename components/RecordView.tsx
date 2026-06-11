"use client";

import { useEffect } from "react";
import { usePrefs } from "./Providers";

/** רושם צפייה ברכיב ל"נצפו לאחרונה" (localStorage). לא מרנדר דבר. */
export function RecordView({ id }: { id: string }) {
  const { recordView } = usePrefs();
  useEffect(() => {
    recordView(id);
  }, [id, recordView]);
  return null;
}
