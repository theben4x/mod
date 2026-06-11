import type { Component } from "@/lib/types";
import { componentImage } from "@/lib/images";
import { ComponentImageView } from "./ComponentImageView";

interface Props {
  component: Component;
  className?: string;
  sizes?: string;
  iconSize?: number;
}

/**
 * עטיפת שרת: פותרת את נתיב התמונה מ-public/components/ (lib/images) ומעבירה
 * ל-ComponentImageView להצגה. לשימוש ברכיבי שרת (כרטיסים, עמוד רכיב, השוואה).
 * ברכיבי client העבירו את ה-src ישירות ל-ComponentImageView.
 */
export function ComponentImage({ component, ...rest }: Props) {
  return <ComponentImageView component={component} src={componentImage(component.id)} {...rest} />;
}
