# mod — השוואת רכיבי חומרה

אתר השוואות מודרני, מינימליסטי ומותאם למובייל, שבו משתמשים משווים שני רכיבי חומרה זה מול זה (כרטיס מסך מול כרטיס מסך, מעבד מול מעבד וכו').

ממשק בעברית (RTL), שמות חומרה ומונחים טכניים באנגלית. פונטים: **Geist Sans** לטקסט, **Geist Mono** למספרים, מפרט ומחירים.

## טכנולוגיות

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** (מצב כהה/בהיר מבוסס class)
- **Geist** Sans/Mono
- `react-markdown` לתוכן הבלוג
- `next/og` לתמונות OpenGraph דינמיות

## הרצה

```bash
npm install
npm run dev      # http://localhost:3000
```

בנייה לפרודקשן:

```bash
npm run build
npm run start
```

בדיקות איכות:

```bash
npm run lint
npm run typecheck
```

## משתני סביבה

העתיקו את `.env.local.example` ל-`.env.local`. כל המשתנים אופציונליים — ללא הגדרה האתר עובד עם מחירי seed מקומיים.

| משתנה | תיאור |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | כתובת בסיס (SEO / sitemap / OG / קישורים מוחלטים) |
| `PRICE_PROVIDER` | `seed` (ברירת מחדל) או `http` למחירים חיים |
| `PRICE_API_URL` | endpoint למחירים חיים (כש-`http`) |
| `PRICE_API_KEY` | מפתח ל-API (נשלח כ-`Authorization: Bearer`) |
| `NEXT_PUBLIC_USD_TO_ILS` | שער המרה לגיבוי (ברירת מחדל 3.72) |

## שכבת המחירים (pluggable)

המחירים מנותקים מהמפרט. ברירת המחדל היא מחירי seed מקומיים (`data/prices.ts`).
לחיבור מקור מחירים אמיתי, הגדירו `PRICE_PROVIDER=http` + `PRICE_API_URL`/`PRICE_API_KEY`.
המערכת מצפה לתשובת JSON בפורמט:

```json
{ "rtx-4090": { "ils": 9500, "usd": 1599, "updatedAt": "2026-06-07T10:00:00Z", "url": "..." } }
```

כל כשל בשליפה נופל אוטומטית למחירי seed (graceful fallback). את הלוגיקה ניתן לערוך בקובץ אחד בלבד: `lib/prices/provider.ts`.

## מבנה

```
app/
  layout.tsx              # RTL, פונטים, theme, header/footer/ticker, SEO גלובלי
  page.tsx                # דף הבית + בורר השוואה
  compare/page.tsx        # בונה השוואה
  compare/[slug]/         # /compare/rtx-5090-vs-rtx-4090 + OG דינמי
  category/[category]/    # עמוד קטגוריה
  component/[id]/         # עמוד רכיב בודד (Product schema)
  about/  blog/  blog/[slug]/
  api/price/route.ts      # endpoint מחירים
  sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.svg
components/                # רכיבי UI (Header, ComparePicker, CompareTable, ...)
lib/                       # types, compare, format, fx, seo, data, prices/
data/                      # categories + components/*.ts + prices, blog, ticker, popular
scripts/gen-data.mjs       # מחולל נתונים מפלט מחקר
```

## הוספת רכיב

1. הוסיפו אובייקט `Component` לקובץ הקטגוריה המתאים תחת `data/components/`.
2. (אופציונלי) הוסיפו מחיר ב-`data/prices.ts`.
3. ה-`id` חייב להיות ייחודי וב-kebab-case אנגלי.

## תכונות

- חיפוש/Autocomplete לבחירת רכיבים, מוגבל לקטגוריה
- סימון מנצח בכל מדד + ברים ויזואליים + פסק דין כולל
- שיתוף השוואה בקישור קבוע (`/compare/a-vs-b`) + Web Share API
- מתג מטבע ₪ / $ ומתג כהה/בהיר (נשמרים ב-localStorage)
- השוואות פופולריות, עמודי קטגוריה ועמודי רכיב
- News Ticker בתחתית (Geist Mono), רקע dot-grid
- SEO מלא: metadata לכל עמוד, JSON-LD (WebSite/Organization/Product/BreadcrumbList/Article/FAQ/ItemList), sitemap, robots, manifest, תמונות OG דינמיות

---

נבנה למאהבי חומרה. 🇮🇱
