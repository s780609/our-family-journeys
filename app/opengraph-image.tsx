import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Our Family Journeys · 家族旅行手帳";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          background: "#f7f1e3",
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(45,36,25,0.04) 0 2px, transparent 2px 22px)",
          fontFamily: "serif",
          color: "#2d2419",
          position: "relative",
        }}
      >
        {/* washi tape accents */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 120,
            width: 220,
            height: 40,
            background: "#90c4d6cc",
            transform: "rotate(-8deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 140,
            width: 200,
            height: 40,
            background: "#e8a57acc",
            transform: "rotate(10deg)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 36, color: "#d96850", marginBottom: 8 }}>
            our family journeys · 家族的旅行手帳
          </div>
          <div
            style={{
              fontSize: 128,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -2,
              display: "flex",
              alignItems: "baseline",
            }}
          >
            <span>我們</span>
            <span style={{ color: "#2e6b8a", margin: "0 8px" }}>去過</span>
            <span>的地方</span>
          </div>
          <div style={{ fontSize: 40, color: "#6b6154", marginTop: 28 }}>
            記錄每一次全家出遊 · 也是下一次的起點
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 24,
            borderTop: "2px dashed rgba(45,36,25,0.25)",
            fontSize: 26,
            color: "#8a7f6f",
          }}
        >
          <span>Our Family Journeys</span>
          <span>家族旅行手帳</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
