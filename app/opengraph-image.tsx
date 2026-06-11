import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "tested — compare PC hardware head to head";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0a0d12",
          color: "#fafafa",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "84px",
              height: "84px",
              borderRadius: "22px",
              background: "#fafafa",
              color: "#0a0d12",
              fontSize: "52px",
              fontWeight: 700,
            }}
          >
            m
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "64px", fontWeight: 700, letterSpacing: "-2px" }}>tested</div>
            <div style={{ fontSize: "22px", color: "#16b981", letterSpacing: "6px" }}>COMPARE</div>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: "44px", fontSize: "56px", fontWeight: 600, lineHeight: 1.15, maxWidth: "900px" }}>
          Compare PC hardware, head&nbsp;to&nbsp;head.
        </div>

        <div style={{ display: "flex", gap: "14px", marginTop: "40px", flexWrap: "wrap" }}>
          {["GPU", "CPU", "RAM", "SSD", "PSU", "Motherboard"].map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "10px 20px",
                borderRadius: "999px",
                border: "1px solid #2a2f37",
                color: "#b6bcc6",
                fontSize: "24px",
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #16b981, transparent)",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
