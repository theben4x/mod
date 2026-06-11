import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

// פונט עברית — Heebo — מאוחסן עצמית (public/fonts/heebo) ומוגדר דרך @font-face
// ב-globals.css עם unicode-range לעברית. הוא חשוף כמשתנה --font-heebo.
// בערימת הפונטים (tailwind) Geist Sans קודם, ולכן לטינית נשארת Geist
// ואותיות עבריות (שאינן ב-Geist) נופלות ל-Heebo — "עברית בלבד".
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsTicker } from "@/components/NewsTicker";
import { AccessibilityWidget } from "@/components/AccessibilityWidget";
import { DotGrid } from "@/components/DotGrid";
import { JsonLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata(),
  title: {
    default: SITE.longName,
    template: `%s · ${SITE.name}`,
  },
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0d12" },
  ],
};

// סקריפט מניעת הבהוב theme — רץ לפני ציור התוכן
const themeScript = `(function(){try{var t=localStorage.getItem('mod-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <JsonLd data={[websiteJsonLd(), organizationJsonLd()]} />
        <Providers>
          <DotGrid />
          <div className="flex min-h-dvh flex-col pb-11">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <NewsTicker />
          <AccessibilityWidget />
        </Providers>
      </body>
    </html>
  );
}
