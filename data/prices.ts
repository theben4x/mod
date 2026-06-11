// ───────────────────────────────────────────────────────────
// מחירי seed (גיבוי). משמשים כש-PRICE_PROVIDER=seed או כשה-API נכשל.
// נוצר אוטומטית ממנגנון איסוף הנתונים. ערכים ב-ILS/USD (street price משוער).
// ───────────────────────────────────────────────────────────

export interface SeedPrice {
  ils: number | null;
  usd: number | null;
  updatedAt: string | null;
  url?: string | null;
}

export const SEED_PRICES: Record<string, SeedPrice> = {
  "rtx-5090": {
    "ils": 11500,
    "usd": 1999,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rtx-5080": {
    "ils": 6200,
    "usd": 999,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rtx-5070-ti": {
    "ils": 4500,
    "usd": 749,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rtx-5060-ti": {
    "ils": 2400,
    "usd": 429,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rtx-4090": {
    "ils": 9500,
    "usd": 1599,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rtx-4070": {
    "ils": 2600,
    "usd": 549,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rx-9070-xt": {
    "ils": 3700,
    "usd": 599,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rx-9070": {
    "ils": 3200,
    "usd": 549,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rx-7900-xtx": {
    "ils": 5200,
    "usd": 899,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rx-7600": {
    "ils": 1300,
    "usd": 269,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "arc-b580": {
    "ils": 1250,
    "usd": 249,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "ryzen-9-9950x3d": {
    "ils": 3199,
    "usd": 699,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "ryzen-7-9800x3d": {
    "ils": 2199,
    "usd": 479,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "intel-core-ultra-9-285k": {
    "ils": 2699,
    "usd": 589,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "intel-core-i9-14900k": {
    "ils": 2299,
    "usd": 549,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "ryzen-9-9900x": {
    "ils": 1999,
    "usd": 429,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "ryzen-7-7800x3d": {
    "ils": 1799,
    "usd": 379,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "ryzen-7-9700x": {
    "ils": 1499,
    "usd": 309,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "intel-core-ultra-5-245k": {
    "ils": 1399,
    "usd": 309,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "intel-core-i5-14600k": {
    "ils": 1249,
    "usd": 279,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "ryzen-5-9600x": {
    "ils": 999,
    "usd": 209,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "ryzen-5-7600x": {
    "ils": 849,
    "usd": 179,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "gskill-trident-z5-rgb-ddr5-8000-cl38": {
    "ils": 1190,
    "usd": 300,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "gskill-trident-z5-royal-ddr5-7200-cl34": {
    "ils": 950,
    "usd": 240,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "kingston-fury-renegade-ddr5-7200-cl38": {
    "ils": 880,
    "usd": 220,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "corsair-dominator-platinum-rgb-ddr5-6000-cl30-64gb": {
    "ils": 1450,
    "usd": 360,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "gskill-trident-z5-neo-rgb-ddr5-6000-cl30": {
    "ils": 620,
    "usd": 155,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "corsair-vengeance-rgb-ddr5-6000-cl30": {
    "ils": 580,
    "usd": 145,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "kingston-fury-beast-ddr5-6000-cl30": {
    "ils": 520,
    "usd": 130,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "crucial-pro-overclocking-ddr5-6000-cl36": {
    "ils": 440,
    "usd": 110,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "corsair-vengeance-ddr5-5600-cl36": {
    "ils": 400,
    "usd": 100,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "gskill-ripjaws-v-ddr4-3600-cl16": {
    "ils": 360,
    "usd": 90,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "corsair-vengeance-lpx-ddr4-3200-cl16": {
    "ils": 320,
    "usd": 80,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "crucial-t705-2tb": {
    "ils": 1090,
    "usd": 250,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "crucial-t700-2tb": {
    "ils": 990,
    "usd": 230,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "seagate-firecuda-540-2tb": {
    "ils": 950,
    "usd": 220,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "samsung-990-pro-2tb": {
    "ils": 720,
    "usd": 170,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "wd-black-sn850x-2tb": {
    "ils": 700,
    "usd": 165,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "kingston-fury-renegade-2tb": {
    "ils": 680,
    "usd": 160,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "crucial-t500-2tb": {
    "ils": 650,
    "usd": 150,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "kingston-kc3000-2tb": {
    "ils": 640,
    "usd": 150,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "samsung-980-pro-2tb": {
    "ils": 600,
    "usd": 140,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "kingston-nv2-2tb": {
    "ils": 430,
    "usd": 105,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "samsung-870-evo-1tb": {
    "ils": 360,
    "usd": 85,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "seasonic-prime-tx-1000-atx3": {
    "ils": 1099,
    "usd": 299,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "be-quiet-straight-power-12-1000w": {
    "ils": 899,
    "usd": 230,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "corsair-hx1000i-2023": {
    "ils": 949,
    "usd": 230,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "cooler-master-x-silent-edge-platinum-1100": {
    "ils": 1149,
    "usd": 300,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "corsair-sf1000-2024": {
    "ils": 899,
    "usd": 230,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "be-quiet-straight-power-12-850w": {
    "ils": 749,
    "usd": 210,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "corsair-rm850x-2024": {
    "ils": 649,
    "usd": 170,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "msi-mpg-a1000g-pcie5": {
    "ils": 699,
    "usd": 180,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "msi-mpg-a850g-pcie5": {
    "ils": 549,
    "usd": 144,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "be-quiet-pure-power-12-m-750w": {
    "ils": 449,
    "usd": 110,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "corsair-rm650e-2025": {
    "ils": 399,
    "usd": 95,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "asus-rog-strix-z890-e-gaming-wifi": {
    "ils": 2199,
    "usd": 500,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "asus-rog-maximus-z790-hero": {
    "ils": 2399,
    "usd": 550,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "asus-rog-strix-x670e-e-gaming-wifi": {
    "ils": 1899,
    "usd": 430,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "msi-mpg-x670e-carbon-wifi": {
    "ils": 1699,
    "usd": 390,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "gigabyte-z790-aorus-elite-ax": {
    "ils": 999,
    "usd": 230,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "msi-mag-b650-tomahawk-wifi": {
    "ils": 849,
    "usd": 200,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "gigabyte-b650-aorus-elite-ax": {
    "ils": 799,
    "usd": 190,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "asus-tuf-gaming-b650-plus-wifi": {
    "ils": 769,
    "usd": 180,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "msi-mag-b760-tomahawk-wifi": {
    "ils": 749,
    "usd": 180,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "asrock-b650m-pg-riptide-wifi": {
    "ils": 649,
    "usd": 150,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "msi-pro-b760m-a-wifi-ddr4": {
    "ils": 499,
    "usd": 120,
    "updatedAt": "2026-06-07T09:00:00Z"
  },
  "rtx-5070": {
    "ils": 2399,
    "usd": 549,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rtx-5060": {
    "ils": 1499,
    "usd": 299,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rtx-4080-super": {
    "ils": 4799,
    "usd": 999,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rtx-4080": {
    "ils": 4699,
    "usd": 999,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rtx-4070-ti-super": {
    "ils": 3799,
    "usd": 799,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rtx-4070-super": {
    "ils": 2899,
    "usd": 599,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rtx-4070-ti": {
    "ils": 3299,
    "usd": 749,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rtx-4060-ti": {
    "ils": 1599,
    "usd": 379,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rtx-4060": {
    "ils": 1199,
    "usd": 299,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rx-7900-xt": {
    "ils": 3299,
    "usd": 649,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rx-7900-gre": {
    "ils": 2399,
    "usd": 549,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rx-7800-xt": {
    "ils": 1999,
    "usd": 479,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rx-7700-xt": {
    "ils": 1699,
    "usd": 419,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "rx-9060-xt": {
    "ils": 1399,
    "usd": 349,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "arc-a770": {
    "ils": 1199,
    "usd": 279,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "arc-a750": {
    "ils": 899,
    "usd": 199,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i9-14900ks": {
    "ils": 2900,
    "usd": 700,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i9-14900kf": {
    "ils": 2200,
    "usd": 540,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i9-13900ks": {
    "ils": 2600,
    "usd": 640,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i7-14700k": {
    "ils": 1700,
    "usd": 410,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i7-14700kf": {
    "ils": 1550,
    "usd": 380,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i7-14700": {
    "ils": 1450,
    "usd": 360,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i9-13900k": {
    "ils": 2000,
    "usd": 490,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i9-13900kf": {
    "ils": 1850,
    "usd": 450,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i7-13700k": {
    "ils": 1500,
    "usd": 370,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i7-13700kf": {
    "ils": 1400,
    "usd": 350,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i5-13600k": {
    "ils": 1050,
    "usd": 280,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i5-13600kf": {
    "ils": 980,
    "usd": 260,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i5-14600kf": {
    "ils": 1050,
    "usd": 280,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-ultra-7-265k": {
    "ils": 1600,
    "usd": 400,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-ultra-7-265kf": {
    "ils": 1450,
    "usd": 380,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-i9-12900ks": {
    "ils": 1600,
    "usd": 400,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-9-9950x": {
    "ils": 2500,
    "usd": 600,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-9-9900x3d": {
    "ils": 2300,
    "usd": 530,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-7-9850x3d": {
    "ils": 2300,
    "usd": 550,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-7-5700x3d": {
    "ils": 950,
    "usd": 230,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-5-7500f": {
    "ils": 750,
    "usd": 180,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-9-7950x3d": {
    "ils": 2400,
    "usd": 560,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-9-7950x": {
    "ils": 2000,
    "usd": 480,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-9-7900x": {
    "ils": 1500,
    "usd": 360,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-7-7700x": {
    "ils": 1200,
    "usd": 300,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-7-7700": {
    "ils": 1100,
    "usd": 280,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-5-7600": {
    "ils": 850,
    "usd": 220,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-7-5800x3d": {
    "ils": 1300,
    "usd": 320,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-5-5600x": {
    "ils": 700,
    "usd": 160,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-5-5600": {
    "ils": 550,
    "usd": 130,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-5-5500": {
    "ils": 400,
    "usd": 100,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-7-5800x": {
    "ils": 850,
    "usd": 200,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "ryzen-9-5900x": {
    "ils": 1100,
    "usd": 280,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "intel-core-ultra-5-245kf": {
    "ils": 1050,
    "usd": 280,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z5-rgb-ddr5-6000-cl30-2x16gb": {
    "ils": 460,
    "usd": 110,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z5-rgb-ddr5-6400-cl32-2x16gb": {
    "ils": 520,
    "usd": 125,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z5-rgb-ddr5-6400-cl32-2x32gb": {
    "ils": 850,
    "usd": 210,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z5-rgb-ddr5-7200-cl34-2x16gb": {
    "ils": 720,
    "usd": 175,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z5-neo-rgb-ddr5-6000-cl28-2x16gb": {
    "ils": 560,
    "usd": 135,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z5-neo-rgb-ddr5-6000-cl30-2x32gb": {
    "ils": 880,
    "usd": 215,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-ripjaws-s5-ddr5-6000-cl30-2x16gb": {
    "ils": 430,
    "usd": 100,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-flare-x5-ddr5-6000-cl30-2x16gb": {
    "ils": 450,
    "usd": 105,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z5-rgb-ddr5-8000-cl38-2x16gb": {
    "ils": 980,
    "usd": 240,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-ripjaws-v-ddr4-3200-cl16-2x8gb": {
    "ils": 180,
    "usd": 45,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z-rgb-ddr4-3200-cl16-2x8gb": {
    "ils": 230,
    "usd": 60,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-flare-x-ddr4-3200-cl14-2x8gb": {
    "ils": 260,
    "usd": 68,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z-ddr4-3600-cl16-2x8gb": {
    "ils": 240,
    "usd": 62,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-rgb-ddr5-6000-cl36-2x16gb": {
    "ils": 440,
    "usd": 105,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-rgb-ddr5-6400-cl36-2x16gb": {
    "ils": 500,
    "usd": 120,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-rgb-ddr5-6400-cl32-2x32gb": {
    "ils": 880,
    "usd": 215,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-ddr5-6000-cl36-2x16gb": {
    "ils": 390,
    "usd": 92,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-dominator-platinum-rgb-ddr5-6600-cl32-2x16gb": {
    "ils": 720,
    "usd": 175,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-lpx-ddr4-3200-cl16-2x8gb": {
    "ils": 175,
    "usd": 44,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-lpx-ddr4-3200-cl16-2x16gb": {
    "ils": 280,
    "usd": 72,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-rgb-pro-ddr4-3200-cl16-2x16gb": {
    "ils": 330,
    "usd": 85,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-lpx-ddr4-3600-cl18-2x8gb": {
    "ils": 210,
    "usd": 54,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-lpx-ddr4-3000-cl15-2x8gb": {
    "ils": 160,
    "usd": 40,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-lpx-ddr4-2666-cl16-2x8gb": {
    "ils": 145,
    "usd": 36,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-beast-ddr5-6000-cl36-2x16gb": {
    "ils": 400,
    "usd": 95,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-beast-rgb-ddr5-6000-cl36-2x16gb": {
    "ils": 450,
    "usd": 108,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-beast-ddr5-5600-cl40-2x16gb": {
    "ils": 360,
    "usd": 85,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-renegade-ddr5-6400-cl32-2x16gb": {
    "ils": 540,
    "usd": 130,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-renegade-rgb-ddr5-7200-cl38-2x16gb": {
    "ils": 760,
    "usd": 185,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-beast-ddr4-3200-cl16-2x8gb": {
    "ils": 170,
    "usd": 43,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-beast-ddr4-3600-cl17-2x8gb": {
    "ils": 200,
    "usd": 50,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-pro-ddr5-6000-cl36-2x16gb": {
    "ils": 380,
    "usd": 90,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-pro-overclocking-ddr5-6400-cl32-2x16gb": {
    "ils": 520,
    "usd": 125,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-ddr5-5600-cl46-2x16gb": {
    "ils": 320,
    "usd": 78,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-ballistix-ddr4-3200-cl16-2x8gb": {
    "ils": 220,
    "usd": 58,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-ballistix-elite-ddr4-3600-cl16-2x8gb": {
    "ils": 280,
    "usd": 72,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-vengeance-rgb-ddr4-3600-cl18-2x16gb": {
    "ils": 360,
    "usd": 92,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z-royal-ddr4-3600-cl16-2x8gb": {
    "ils": 360,
    "usd": 92,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "gskill-trident-z5-rgb-ddr5-7600-cl36-2x16gb": {
    "ils": 840,
    "usd": 205,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-renegade-ddr5-6000-cl32-2x16gb": {
    "ils": 480,
    "usd": 115,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "teamgroup-t-force-delta-rgb-ddr5-6000-cl30-2x16gb": {
    "ils": 440,
    "usd": 105,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "adata-xpg-lancer-rgb-ddr5-6000-cl30-2x16gb": {
    "ils": 430,
    "usd": 102,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-sn8100-2tb": {
    "ils": 999,
    "usd": 280,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-sn8100-1tb": {
    "ils": 599,
    "usd": 180,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-sn8100-4tb": {
    "ils": 1899,
    "usd": 550,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-9100-pro-2tb": {
    "ils": 949,
    "usd": 270,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-9100-pro-1tb": {
    "ils": 569,
    "usd": 170,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-9100-pro-4tb": {
    "ils": 1849,
    "usd": 530,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-t705-1tb": {
    "ils": 599,
    "usd": 180,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-t705-4tb": {
    "ils": 1999,
    "usd": 580,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-t700-1tb": {
    "ils": 549,
    "usd": 160,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-t710-2tb": {
    "ils": 949,
    "usd": 270,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-firecuda-540-1tb": {
    "ils": 599,
    "usd": 180,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-990-pro-1tb": {
    "ils": 459,
    "usd": 130,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-990-pro-4tb": {
    "ils": 1399,
    "usd": 340,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-sn850x-1tb": {
    "ils": 449,
    "usd": 120,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-sn850x-4tb": {
    "ils": 1499,
    "usd": 360,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-sn850-1tb": {
    "ils": 399,
    "usd": 110,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-fury-renegade-1tb": {
    "ils": 429,
    "usd": 115,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-kc3000-1tb": {
    "ils": 399,
    "usd": 105,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-t500-1tb": {
    "ils": 369,
    "usd": 95,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-p5-plus-1tb": {
    "ils": 339,
    "usd": 85,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-p5-plus-2tb": {
    "ils": 599,
    "usd": 150,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-980-pro-1tb": {
    "ils": 399,
    "usd": 100,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-990-evo-plus-2tb": {
    "ils": 599,
    "usd": 150,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-980-1tb": {
    "ils": 299,
    "usd": 75,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-970-evo-plus-1tb": {
    "ils": 329,
    "usd": 80,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-970-evo-plus-2tb": {
    "ils": 599,
    "usd": 150,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-blue-sn580-1tb": {
    "ils": 279,
    "usd": 70,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-blue-sn570-1tb": {
    "ils": 259,
    "usd": 65,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-p3-plus-2tb": {
    "ils": 449,
    "usd": 110,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-p3-1tb": {
    "ils": 239,
    "usd": 60,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-nv2-1tb": {
    "ils": 249,
    "usd": 60,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-nv3-1tb": {
    "ils": 299,
    "usd": 75,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-sn770-1tb": {
    "ils": 319,
    "usd": 80,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sabrent-rocket-4-plus-2tb": {
    "ils": 699,
    "usd": 170,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-mp600-pro-xt-2tb": {
    "ils": 729,
    "usd": 180,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "adata-legend-960-2tb": {
    "ils": 649,
    "usd": 160,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "teamgroup-mp44-2tb": {
    "ils": 499,
    "usd": 120,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "lexar-nm1090-pro-2tb": {
    "ils": 899,
    "usd": 250,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-870-evo-2tb": {
    "ils": 649,
    "usd": 150,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-mx500-1tb": {
    "ils": 329,
    "usd": 75,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-bx500-1tb": {
    "ils": 249,
    "usd": 55,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-a400-480gb": {
    "ils": 159,
    "usd": 35,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-gold-12tb": {
    "ils": 1150,
    "usd": 309,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-gold-10tb": {
    "ils": 980,
    "usd": 269,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-gold-8tb": {
    "ils": 820,
    "usd": 229,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-gold-6tb": {
    "ils": 720,
    "usd": 189,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-gold-4tb": {
    "ils": 540,
    "usd": 139,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-gold-2tb": {
    "ils": 420,
    "usd": 109,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-red-pro-6tb": {
    "ils": 730,
    "usd": 189,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-red-10tb": {
    "ils": 1050,
    "usd": 279,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-6tb": {
    "ils": 760,
    "usd": 199,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-4tb": {
    "ils": 560,
    "usd": 149,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-2tb": {
    "ils": 380,
    "usd": 99,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-1tb": {
    "ils": 290,
    "usd": 75,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-blue-4tb": {
    "ils": 420,
    "usd": 99,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-blue-2tb": {
    "ils": 280,
    "usd": 64,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-blue-1tb": {
    "ils": 210,
    "usd": 45,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-purple-4tb": {
    "ils": 430,
    "usd": 109,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-red-plus-4tb": {
    "ils": 470,
    "usd": 119,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-barracuda-7200-14-3tb": {
    "ils": 320,
    "usd": 79,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-barracuda-7200-14-2tb": {
    "ils": 270,
    "usd": 64,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-barracuda-7200-14-1tb": {
    "ils": 200,
    "usd": 49,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-barracuda-3tb": {
    "ils": 330,
    "usd": 79,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-barracuda-2tb": {
    "ils": 260,
    "usd": 59,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-barracuda-1tb": {
    "ils": 190,
    "usd": 45,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-barracuda-4tb": {
    "ils": 400,
    "usd": 89,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-ironwolf-4tb": {
    "ils": 490,
    "usd": 119,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-ironwolf-8tb": {
    "ils": 850,
    "usd": 219,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-ironwolf-pro-8tb": {
    "ils": 950,
    "usd": 249,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-skyhawk-4tb": {
    "ils": 430,
    "usd": 109,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-firecuda-sshd-2tb": {
    "ils": 420,
    "usd": 99,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-exos-x16-16tb": {
    "ils": 1450,
    "usd": 379,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-exos-x18-18tb": {
    "ils": 1650,
    "usd": 429,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-x300-8tb": {
    "ils": 820,
    "usd": 199,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-x300-6tb": {
    "ils": 680,
    "usd": 169,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-x300-5tb": {
    "ils": 590,
    "usd": 149,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-p300-3tb": {
    "ils": 330,
    "usd": 79,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-p300-2tb": {
    "ils": 260,
    "usd": 59,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-p300-1tb": {
    "ils": 180,
    "usd": 42,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-n300-8tb": {
    "ils": 860,
    "usd": 219,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-n300-4tb": {
    "ils": 520,
    "usd": 129,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-dt01aca200-2tb": {
    "ils": 250,
    "usd": 59,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-dt01aca100-1tb": {
    "ils": 170,
    "usd": 42,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "toshiba-mg08-16tb": {
    "ils": 1500,
    "usd": 389,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-red-pro-4tb": {
    "ils": 590,
    "usd": 149,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-red-plus-8tb": {
    "ils": 870,
    "usd": 219,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-red-plus-6tb": {
    "ils": 660,
    "usd": 169,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-ironwolf-pro-16tb": {
    "ils": 1550,
    "usd": 399,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-skyhawk-8tb": {
    "ils": 820,
    "usd": 209,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t9-2tb": {
    "ils": 750,
    "usd": 190,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t9-1tb": {
    "ils": 430,
    "usd": 110,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t7-shield-2tb": {
    "ils": 620,
    "usd": 160,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t7-shield-1tb": {
    "ils": 380,
    "usd": 95,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t7-1tb": {
    "ils": 340,
    "usd": 90,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t7-500gb": {
    "ils": 220,
    "usd": 60,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t5-evo-2tb": {
    "ils": 520,
    "usd": 130,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-extreme-pro-portable-ssd-v2-2tb": {
    "ils": 780,
    "usd": 200,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-extreme-pro-portable-ssd-v2-1tb": {
    "ils": 450,
    "usd": 120,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-extreme-portable-ssd-v2-2tb": {
    "ils": 560,
    "usd": 150,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-extreme-portable-ssd-v2-1tb": {
    "ils": 330,
    "usd": 90,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-x9-pro-2tb": {
    "ils": 540,
    "usd": 140,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-x10-pro-2tb": {
    "ils": 680,
    "usd": 175,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-x10-pro-1tb": {
    "ils": 400,
    "usd": 105,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-x6-1tb": {
    "ils": 260,
    "usd": 70,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-my-passport-ssd-2tb": {
    "ils": 590,
    "usd": 150,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-my-passport-ssd-1tb": {
    "ils": 350,
    "usd": 90,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-extreme-pro-usb-3-2-256gb": {
    "ils": 300,
    "usd": 75,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-extreme-pro-usb-3-2-128gb": {
    "ils": 190,
    "usd": 50,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-datatraveler-max-1tb": {
    "ils": 560,
    "usd": 140,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-datatraveler-max-256gb": {
    "ils": 220,
    "usd": 55,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-datatraveler-kyson-128gb": {
    "ils": 90,
    "usd": 22,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-ultra-dual-drive-go-128gb": {
    "ils": 75,
    "usd": 18,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-ultra-dual-drive-luxe-256gb": {
    "ils": 130,
    "usd": 32,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-ultra-flair-usb-3-0-64gb": {
    "ils": 45,
    "usd": 11,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-ultra-usb-3-0-64gb": {
    "ils": 40,
    "usd": 10,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-ultra-fit-usb-3-1-128gb": {
    "ils": 70,
    "usd": 17,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-fit-plus-256gb": {
    "ils": 140,
    "usd": 35,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-bar-plus-128gb": {
    "ils": 90,
    "usd": 22,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-datatraveler-100-g3-64gb": {
    "ils": 40,
    "usd": 10,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "corsair-flash-voyager-gtx-256gb": {
    "ils": 280,
    "usd": 70,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-datatraveler-vault-privacy-3-0-64gb": {
    "ils": 280,
    "usd": 70,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-ironkey-vault-privacy-50-128gb": {
    "ils": 420,
    "usd": 105,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t5-evo-4tb": {
    "ils": 950,
    "usd": 240,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-my-passport-2tb": {
    "ils": 280,
    "usd": 75,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-my-passport-5tb": {
    "ils": 520,
    "usd": 130,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-elements-portable-2tb": {
    "ils": 250,
    "usd": 65,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-expansion-portable-2tb": {
    "ils": 260,
    "usd": 70,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-expansion-desktop-8tb": {
    "ils": 650,
    "usd": 160,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-elements-desktop-8tb": {
    "ils": 640,
    "usd": 160,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-backup-plus-slim-2tb": {
    "ils": 270,
    "usd": 70,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "seagate-one-touch-hdd-2tb": {
    "ils": 300,
    "usd": 75,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "lacie-rugged-mini-2tb": {
    "ils": 480,
    "usd": 120,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "lacie-rugged-ssd-1tb": {
    "ils": 620,
    "usd": 160,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "adata-se880-1tb": {
    "ils": 400,
    "usd": 100,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-xs2000-2tb": {
    "ils": 700,
    "usd": 180,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "kingston-xs1000-1tb": {
    "ils": 300,
    "usd": 75,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "samsung-t9-4tb": {
    "ils": 1400,
    "usd": 360,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "crucial-x9-pro-1tb": {
    "ils": 320,
    "usd": 85,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "sandisk-extreme-portable-ssd-v2-4tb": {
    "ils": 1100,
    "usd": 280,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "wd-black-p50-game-drive-ssd-1tb": {
    "ils": 560,
    "usd": 145,
    "updatedAt": "2026-06-08T09:00:00Z"
  },
  "adata-se920-2tb": {
    "ils": 900,
    "usd": 230,
    "updatedAt": "2026-06-08T09:00:00Z"
  }
};
