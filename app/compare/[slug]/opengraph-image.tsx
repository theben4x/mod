import { ImageResponse } from "next/og";
import { parseSlug } from "@/lib/compare";
import { getComponent } from "@/lib/data";
import { getCategory } from "@/data/categories";

export const runtime = "nodejs";
export const alt = "השוואת רכיבי חומרה ב-tested";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CompareOgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const parsed = parseSlug(decodeURIComponent(slug));
  const a = parsed ? getComponent(parsed[0]) : undefined;
  const b = parsed ? getComponent(parsed[1]) : undefined;
  const cat = a ? getCategory(a.category) : undefined;

  const nameA = a?.name ?? "Component A";
  const nameB = b?.name ?? "Component B";
  const catLabel = cat?.nameEn ?? "Hardware";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0d12",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        {/* כותרת עליונה */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "44px 60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "#fafafa",
                color: "#0a0d12",
                fontSize: "32px",
                fontWeight: 700,
              }}
            >
              m
            </div>
            <div style={{ fontSize: "34px", fontWeight: 700 }}>tested</div>
          </div>
          <div style={{ display: "flex", fontSize: "26px", color: "#16b981", letterSpacing: "2px" }}>{catLabel}</div>
        </div>

        {/* גוף — A vs B */}
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", gap: "36px", padding: "0 70px" }}>
          <div style={{ display: "flex", flex: 1, justifyContent: "flex-end", textAlign: "right", fontSize: "52px", fontWeight: 700, lineHeight: 1.1 }}>
            {nameA}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "96px",
              height: "96px",
              borderRadius: "999px",
              background: "#16b981",
              color: "#0a0d12",
              fontSize: "36px",
              fontWeight: 700,
            }}
          >
            VS
          </div>
          <div style={{ display: "flex", flex: 1, justifyContent: "flex-start", textAlign: "left", fontSize: "52px", fontWeight: 700, lineHeight: 1.1 }}>
            {nameB}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "44px", fontSize: "24px", color: "#8b919b" }}>
          full spec comparison · prices · winner per metric
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "8px", background: "linear-gradient(90deg, #16b981, transparent)" }} />
      </div>
    ),
    { ...size },
  );
}
