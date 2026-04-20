"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Trip } from "@/lib/types";

const LIB_SRC = (key: string) =>
  `https://maps.googleapis.com/maps/api/js?key=${key}&v=weekly&loading=async&libraries=marker`;

// East Asia view
const DEFAULT_CENTER = { lat: 28, lng: 125 };
const DEFAULT_ZOOM = 4;

// Retro / vintage paper-toned style — matches the handbook aesthetic
const RETRO_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#efe3c0" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5a4a35" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f7f1e3" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#c9b890" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#8a7557" }, { weight: 1 }] },
  { featureType: "administrative.province", elementType: "geometry.stroke", stylers: [{ color: "#bda87a" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#ede0b6" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e4d4a0" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c9cf8e" }] },
  { featureType: "road", stylers: [{ visibility: "simplified" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#d8c48a" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#c9a85a" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#a4c1ce" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#2a4856" }] },
];

// Coral water-drop pin SVG matching the handbook
function pinSvg(active: boolean) {
  const fill = active ? "#d96850" : "#d96850";
  const stroke = "#2d2419";
  const badge = active ? "#e8b04a" : "#fffaec";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${active ? 44 : 36}" height="${active ? 54 : 44}" viewBox="0 0 36 44">
    <defs><filter id="sh" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#3a2817" flood-opacity="0.4"/>
    </filter></defs>
    <g filter="url(#sh)">
      <path d="M18 2 C 9 2 3 8 3 17 c 0 11 15 25 15 25 s 15 -14 15 -25 c 0 -9 -6 -15 -15 -15 z"
            fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      <circle cx="18" cy="17" r="6.5" fill="${badge}" stroke="${stroke}" stroke-width="1.8"/>
      <circle cx="18" cy="17" r="2.2" fill="${stroke}"/>
    </g>
  </svg>`;
}

function loadMapsScript(key: string): Promise<typeof google> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("no window"));
    const g = (window as any).google;
    if (g?.maps) return resolve(g);
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps]');
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).google));
      existing.addEventListener("error", () => reject(new Error("maps script failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = LIB_SRC(key);
    s.async = true;
    s.defer = true;
    s.setAttribute("data-google-maps", "1");
    s.onload = () => resolve((window as any).google);
    s.onerror = () => reject(new Error("maps script failed"));
    document.head.appendChild(s);
  });
}

export function HomeMap({ trips }: { trips: Trip[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "nokey">("loading");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Trips with coordinates
  const mappable = trips.filter((t) => typeof t.lat === "number" && typeof t.lng === "number");

  useEffect(() => {
    if (!apiKey) { setStatus("nokey"); return; }
    if (!ref.current) return;
    let cancelled = false;

    (window as any).gm_authFailure = () => {
      console.error("[HomeMap] Google Maps auth failed — API key invalid, restricted by referrer, or billing not enabled");
      if (!cancelled) setStatus("error");
    };

    const timeout = window.setTimeout(() => {
      if (!cancelled && status === "loading") {
        console.error("[HomeMap] Google Maps script load timed out after 15s");
        setStatus("error");
      }
    }, 15000);

    loadMapsScript(apiKey)
      .then((g) => {
        window.clearTimeout(timeout);
        if (cancelled || !ref.current) return;
        const map = new g.maps.Map(ref.current, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          styles: RETRO_STYLE,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
          gestureHandling: "greedy",
          backgroundColor: "#a4c1ce",
          clickableIcons: false,
        });

        const info = new g.maps.InfoWindow({ pixelOffset: new g.maps.Size(0, -12) });

        mappable.forEach((t) => {
          const pinDiv = document.createElement("div");
          pinDiv.style.cursor = "pointer";
          pinDiv.style.transform = "translateY(0)";
          pinDiv.style.transition = "transform 200ms";
          pinDiv.innerHTML = pinSvg(false);
          pinDiv.addEventListener("mouseenter", () => { pinDiv.innerHTML = pinSvg(true); pinDiv.style.transform = "translateY(-3px)"; });
          pinDiv.addEventListener("mouseleave", () => { pinDiv.innerHTML = pinSvg(false); pinDiv.style.transform = "translateY(0)"; });

          // Prefer Advanced Marker if available
          const AdvancedMarker = (g.maps as any).marker?.AdvancedMarkerElement;
          let marker: any;
          if (AdvancedMarker) {
            marker = new AdvancedMarker({
              map,
              position: { lat: t.lat!, lng: t.lng! },
              content: pinDiv,
              title: t.title,
            });
          } else {
            marker = new g.maps.Marker({
              map,
              position: { lat: t.lat!, lng: t.lng! },
              title: t.title,
              icon: {
                url: "data:image/svg+xml;utf8," + encodeURIComponent(pinSvg(false)),
                scaledSize: new g.maps.Size(36, 44),
                anchor: new g.maps.Point(18, 44),
              },
            });
          }

          const html = `
            <div style="font-family:'Noto Serif TC',serif;min-width:220px;max-width:260px;padding:4px 2px 2px;">
              <div style="font-family:'Caveat',cursive;font-size:20px;color:#d96850;line-height:1;margin-bottom:4px;">
                ${t.year} · ${t.dateRangeLabel ?? ""}
              </div>
              <div style="font-weight:800;font-size:17px;color:#2d2419;line-height:1.3;margin-bottom:2px;">
                ${t.title}
              </div>
              ${t.subtitle ? `<div style="font-size:13px;color:#5a4a35;margin-bottom:6px;">${t.subtitle}</div>` : ""}
              <div style="font-size:13px;color:#8a7557;margin-bottom:10px;">📍 ${t.location}</div>
              <a href="/trips/${t.slug}"
                 style="display:inline-block;padding:8px 14px;background:#2e6b8a;color:#fff;border-radius:10px;text-decoration:none;font-size:13px;font-weight:700;">
                查看行程 →
              </a>
            </div>`;

          marker.addListener?.("click", () => {
            info.setContent(html);
            info.setPosition({ lat: t.lat!, lng: t.lng! });
            info.open({ map, anchor: AdvancedMarker ? marker : marker });
          });
        });

        setStatus("ready");
      })
      .catch((err) => {
        window.clearTimeout(timeout);
        console.error("[HomeMap] Google Maps load failed:", err);
        if (!cancelled) setStatus("error");
      });

    return () => { cancelled = true; window.clearTimeout(timeout); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, mappable.length]);

  if (status === "nokey" || status === "error") {
    return <FallbackMap trips={trips} reason={status} />;
  }

  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        padding: 14,
        background: "#f6ecce",
        boxShadow:
          "0 1px 2px rgba(60,40,10,.08), 0 12px 32px rgba(60,40,10,.12), 0 0 0 3px #6b4a28, 0 0 0 5px #efe3c0, 0 0 0 8px #6b4a28",
      }}
    >
      <div className="relative aspect-[10/7] md:aspect-[10/7] max-md:aspect-[3/4] w-full rounded overflow-hidden bg-[#a4c1ce]">
        <div ref={ref} className="absolute inset-0" />
        {status === "loading" && (
          <div className="absolute inset-0 grid place-items-center text-[var(--ink-soft)]">
            <div className="text-center">
              <div className="font-[family-name:var(--font-hand)] text-2xl mb-1">展開地圖中...</div>
              <div className="text-xs">Loading chart</div>
            </div>
          </div>
        )}
        {/* Title card */}
        <div
          className="absolute top-4 left-4 border px-3 py-2 z-[5] max-w-[240px] pointer-events-none"
          style={{ background: "#fffaecee", borderColor: "#6b4a28" }}
        >
          <div style={{ fontFamily: "'Caveat', cursive", fontSize: 22, color: "#d96850", lineHeight: 1 }}>
            家族旅行地圖
          </div>
          <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 11, color: "#8a7557", letterSpacing: 2, marginTop: 2 }}>
            {mappable.length} DESTINATIONS
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Fallback: static hand-drawn antique-style map with clickable pins ---
function FallbackMap({ trips, reason }: { trips: Trip[]; reason: "nokey" | "error" }) {
  return (
    <div
      className="relative rounded-lg overflow-hidden"
      style={{
        padding: 14,
        background: "#f6ecce",
        boxShadow:
          "0 1px 2px rgba(60,40,10,.08), 0 12px 32px rgba(60,40,10,.12), 0 0 0 3px #6b4a28, 0 0 0 5px #efe3c0, 0 0 0 8px #6b4a28",
      }}
    >
      <div className="relative aspect-[10/7] max-md:aspect-[3/4] w-full rounded overflow-hidden bg-[#d9c99a] grid place-items-center p-8">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">🗺️</div>
          <div className="font-serif font-bold text-xl text-[var(--ink)] mb-2">
            {reason === "nokey" ? "請設定 Google Maps API Key" : "地圖暫時無法載入"}
          </div>
          <div className="text-sm text-[var(--ink-soft)] mb-4">
            {reason === "nokey"
              ? "在 Vercel 環境變數設 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY 後即可顯示互動地圖"
              : "請檢查網路或稍後再試"}
          </div>
          <div className="flex flex-col gap-2">
            {trips.map((t) => (
              <Link
                key={t.slug}
                href={`/trips/${t.slug}`}
                className="block px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--rule)] text-left"
              >
                <div className="font-[family-name:var(--font-hand)] text-lg text-[var(--coral)]">
                  {t.year} · {t.location}
                </div>
                <div className="text-sm text-[var(--ink)]">{t.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
