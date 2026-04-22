import { ImageResponse } from "next/og";
import { getTrip } from "@/lib/trips";
import { resolveTripMode } from "@/lib/trip-mode";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "行程手帳 · Our Family Journeys";

// Rendered on demand; CJK font subsetting requires network access from the
// runtime, which is not always available at build time.
export const dynamic = "force-dynamic";

const VARIANT_BG: Record<string, string> = {
  ocean: "linear-gradient(135deg, #2e6b8a 0%, #1f4f6c 100%)",
  coral: "linear-gradient(135deg, #d96850 0%, #b54a36 100%)",
  leaf: "linear-gradient(135deg, #6b8e4e 0%, #4a6b34 100%)",
  sun: "linear-gradient(135deg, #e8b04a 0%, #c48a24 100%)",
  sand: "linear-gradient(135deg, #c9b890 0%, #a89770 100%)",
  sky: "linear-gradient(135deg, #90c4d6 0%, #5fa0b8 100%)",
  night: "linear-gradient(135deg, #2d2a44 0%, #1a1830 100%)",
  earth: "linear-gradient(135deg, #8a6b4e 0%, #5a4530 100%)",
};

export default async function TripOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = await getTrip(slug);

  const title = trip?.title ?? "Our Family Journeys";
  const subtitle = trip?.subtitle ?? trip?.locationEn ?? "家族旅行手帳";
  const dateRange = trip?.dateRangeLabel ?? "";
  const location = trip?.locationEn || trip?.location || "";
  const year = trip?.year ?? "";
  const mode = trip ? resolveTripMode(trip) : "record";
  const modeLabel = mode === "planning" ? "規劃中" : "旅程紀錄";
  const modeBg = mode === "planning" ? "#e8b04a" : "#6b8e4e";
  const modeFg = mode === "planning" ? "#2d2419" : "#ffffff";
  const bg = VARIANT_BG[trip?.coverVariant ?? "ocean"] ?? VARIANT_BG.ocean;
  const days = trip?.days?.length ?? 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f7f1e3",
          fontFamily: "serif",
          color: "#2d2419",
        }}
      >
        {/* Left: colored cover block (variant) */}
        <div
          style={{
            width: 460,
            height: "100%",
            background: bg,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            color: "#ffffff",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, opacity: 0.85, letterSpacing: 4 }}>
              OUR FAMILY JOURNEY
            </div>
            <div style={{ fontSize: 26, marginTop: 10, opacity: 0.9 }}>No. 01</div>
          </div>
          <div
            style={{
              alignSelf: "flex-start",
              border: "3px solid rgba(255,255,255,0.85)",
              borderRadius: 999,
              padding: "18px 28px",
              transform: "rotate(-8deg)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1 }}>{year}</div>
            <div style={{ fontSize: 18, letterSpacing: 4, marginTop: 4 }}>
              {String(location).split(",")[0].slice(0, 16).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Right: trip details */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "72px 72px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 36,
              right: 72,
              background: modeBg,
              color: modeFg,
              padding: "8px 20px",
              borderRadius: 999,
              fontSize: 24,
              transform: "rotate(2deg)",
            }}
          >
            {modeLabel}
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 48 }}>
            <div style={{ fontSize: 30, color: "#d96850", marginBottom: 14 }}>
              {subtitle}
            </div>
            <div
              style={{
                fontSize: title.length > 14 ? 72 : 88,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: -1,
                color: "#2d2419",
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: 24,
              borderTop: "2px dashed rgba(45,36,25,0.25)",
              fontSize: 28,
              color: "#6b6154",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", gap: 24 }}>
              <span>📅 {dateRange}</span>
              {days > 0 && <span>· {days} 天行程</span>}
            </div>
            <div style={{ fontSize: 24, color: "#8a7f6f" }}>
              Our Family Journeys · 家族旅行手帳
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
