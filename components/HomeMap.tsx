"use client";
import { useState } from "react";
import Link from "next/link";
import type { Trip } from "@/lib/types";

/**
 * Antique nautical chart of East Asia.
 * Region: lon 95-150, lat 8-50.  SVG 1000 × 700, equirectangular.
 */
const REGION = { lon0: 95, lon1: 150, lat0: 8, lat1: 50 };
const VB = { w: 1000, h: 700 };

function project(lon: number, lat: number): readonly [number, number] {
  const x = ((lon - REGION.lon0) / (REGION.lon1 - REGION.lon0)) * VB.w;
  const y = ((REGION.lat1 - lat) / (REGION.lat1 - REGION.lat0)) * VB.h;
  return [x, y] as const;
}

const KNOWN_COORDS: Record<string, [number, number]> = {
  "okinawa-2026": [127.68, 26.21],
};

type LonLat = [number, number];

const LAND: LonLat[][] = [
  // Mainland Asia (China + SE Asia + Mongolia) — single non-self-intersecting loop.
  [
    [95,50],[100,50],[106,50],[112,50],[118,50],[122,50.5],[126,52],[130,52.5],
    [133,51.5],[134.5,49],[135,47.8],[134.5,47],[133.5,46.2],[132.5,45.5],
    [131.5,44.8],[131.3,43.8],[131.2,43],[130.6,42.7],[130.4,42.3],
    [125,41],[124,40.5],[123.8,40],
    [123.3,40.1],[122.3,40.3],[121.8,40.6],[121.3,40.7],[121,40.2],
    [121.5,39.8],[121.7,39.3],[121.4,39],[121,38.8],[120.5,38.5],
    [119.8,38.5],[119,38.8],[118.5,38.8],[117.9,38.6],[117.5,38.5],
    [117.8,38],[118,37.6],[118.8,37.5],
    [119.5,37.5],[120.3,37.7],[121.3,37.5],[122.2,37.4],[122.7,37],
    [122.3,36.8],[121.5,36.6],[120.5,36.3],[119.7,35.8],
    [120.2,35],[120.3,34.3],[121,33.5],[121.3,32.7],[121.7,32],[121.9,31.5],
    [121.9,31.1],[122,30.5],[121.5,30.1],[121.3,29.4],[121.6,28.8],
    [121.2,28],[120.5,27.3],[120,26.7],[119.6,26],[119.5,25.4],
    [118.8,24.7],[118.2,24.5],[117.5,23.9],[116.8,23.4],[116,23],[115,22.7],
    [114.3,22.5],[114.1,22.2],[113.7,22.2],[113.5,22.3],[113.3,22.1],
    [113,21.9],[112,21.7],[111,21.4],[110.5,21.2],
    [110.4,20.8],[110.3,20.3],[110.2,19.9],[109.9,19.9],[109.8,20.4],
    [109.6,20.9],[109.2,21.2],[108.5,21.5],
    [107.3,21],[107,20.7],[106.7,20.3],[106.3,19.5],[106,18.8],[106.5,18],
    [107.5,17],[108.3,16.3],[109,15],[109.3,13.5],[109.3,12],[108.8,11.3],
    [107.5,10.8],[106.8,10.6],[106,10.4],[105,10],[104.5,10.3],[104,10.5],
    [103.5,11],[103,12],[102.7,13],
    [102.5,14.5],[102,16],[101.5,17.5],[100.5,19],[100,20.5],[99,21.5],
    [98.5,22.5],[98,24],[97.5,25.5],[97,27],[96.3,28.5],[96,29.5],
    [95.3,30],[95,35],[95,40],[95,45],[95,50],
  ],
  // Korean Peninsula
  [
    [125,41],[125.5,40.5],[126,40],[126.3,39.8],[126,39.2],[125.5,38.8],
    [125,38.5],[125.2,38],[126,37.6],[126.5,37.5],[126.4,37],[126.6,36.5],
    [126.4,36],[126.6,35.5],[126.3,34.8],[126.5,34.3],[127.3,34.3],
    [128,34.7],[128.8,34.9],[129.3,35.1],[129.5,35.6],[129.5,36.3],
    [129.3,37],[128.8,37.8],[128.5,38.3],[128.7,38.7],[129,39.3],
    [129.5,40],[129.8,41],[130.2,41.8],[130.4,42.3],[129.5,42.3],
    [128.5,42],[127.5,41.7],[126.5,41.5],[125.5,41.3],[125,41],
  ],
  // Japan: Honshu
  [
    [130.9,34.4],[131.6,34.1],[132.4,34.05],[133.1,34.15],[133.9,34.25],
    [134.6,34.7],[135.05,34.65],[135.35,34.3],
    [135.6,34.2],[135.9,33.8],[136.2,33.6],[136.6,34.1],[136.9,34.3],
    [137.3,34.6],[138,34.65],[138.5,34.6],[138.8,34.9],[139.1,35.15],
    [139.8,35.3],[139.95,35.65],[140.1,35.4],
    [140.5,35.1],[140.85,35.3],[140.9,35.7],[140.7,36],[141.05,36.4],
    [141.1,37.3],[141.4,38.2],[141.6,39],[141.9,39.7],[141.7,40.4],
    [141.4,40.9],[141,41.25],[140.7,41.4],[140.3,41.3],[139.95,40.7],
    [139.7,39.9],[139.6,39.1],[139.9,38.5],[139.55,37.8],
    [138.9,37.4],[137.5,37.35],[137.35,37.55],[137.05,37.5],[136.85,37.1],
    [136.7,36.8],[136.3,36.1],[135.95,35.7],[135.5,35.6],[134.9,35.55],
    [134.3,35.5],[133.6,35.55],[132.95,35.5],[132.35,35.4],[131.6,35.1],
    [131.15,34.8],[130.9,34.4],
  ],
  // Japan: Hokkaido
  [
    [140.2,41.8],[140.7,41.6],[141.2,41.5],[141.7,41.7],[142.5,42],
    [143.3,42.3],[144,42.6],[144.8,43],[145.3,43.5],[145.7,44.2],
    [145.3,44.8],[144.6,45.2],[143.7,45.4],[142.7,45.4],[141.9,45.2],
    [141.5,44.8],[141.3,44.2],[141,43.5],[140.6,42.8],[140.3,42.3],[140.2,41.8],
  ],
  // Japan: Kyushu
  [
    [130,31.5],[130.5,31],[131.1,30.7],[131.5,31.2],[131.7,31.8],
    [131.8,32.5],[131.7,33.1],[131.3,33.5],[130.7,33.4],[130.3,33.2],
    [130.1,32.7],[129.8,32.3],[129.7,31.8],[130,31.5],
  ],
  // Japan: Shikoku
  [
    [132.5,33],[133.3,33.1],[134,33.3],[134.5,33.7],[134.6,34.1],
    [134.3,34.3],[133.6,34.3],[132.9,34.1],[132.6,33.5],[132.5,33],
  ],
  // Taiwan
  [
    [120,22],[120.3,21.9],[120.7,22],[121.1,22.3],[121.5,22.8],
    [121.8,23.5],[121.9,24.2],[121.8,24.9],[121.5,25.2],[121.1,25.3],
    [120.7,24.8],[120.3,24.2],[120.1,23.5],[120,22.8],[120,22],
  ],
  // Okinawa main island
  [
    [127.6,26.1],[127.85,26.15],[128.1,26.4],[128.3,26.7],[128.2,26.95],
    [127.95,27],[127.75,26.8],[127.6,26.45],[127.55,26.2],[127.6,26.1],
  ],
  // Philippines: Luzon
  [
    [119.8,14],[120.3,13.6],[121,13.8],[121.5,14],[122,14.3],[122.5,14.8],
    [122.3,15.5],[122.1,16.2],[121.8,17],[121.5,18],[121,18.5],[120.5,18.5],
    [120.2,17.5],[119.9,16.3],[119.8,15.2],[119.8,14],
  ],
  // Philippines: Mindanao
  [
    [121.8,7.5],[122.5,6.8],[123.5,6.7],[124.5,6.8],[125.5,7],[126,7.5],
    [126.5,8.5],[126.3,9.5],[125.6,10],[124.5,10],[123.5,9.8],[122.5,9],
    [122,8.3],[121.8,7.5],
  ],
  // Visayas
  [[123.5,10.5],[124.2,10.3],[124.5,10.8],[124,11.4],[123.5,11.1],[123.5,10.5]],
  [[121.8,11.5],[122.3,11.3],[122.5,11.8],[122,12.1],[121.8,11.5]],
  [[124.5,11.5],[125.2,11.3],[125.3,12],[124.9,12.5],[124.5,11.5]],
  // Hainan
  [
    [108.6,18.3],[109.3,18.2],[110.1,18.3],[110.7,18.7],[111,19.2],
    [110.9,19.8],[110.4,20.1],[109.7,20.1],[108.9,19.8],[108.6,19.2],[108.6,18.3],
  ],
  // Sakhalin (partial)
  [
    [142,46],[142.5,46.5],[143,47.5],[143.3,48.8],[143.5,49.5],[144,49.8],
    [144.3,49.5],[143.8,48.5],[143.5,47.5],[143,46.5],[142.5,46],[142,46],
  ],
];

const ISLETS: [number, number, number][] = [
  [124.2,24.3,3],[124.8,24.5,2.5],[125.3,24.6,2.5],
  [126,25.5,2.8],[126.8,25.8,3],
  [131,30.3,3],[130.5,29.8,2.5],
  [139.8,34,2.5],[139.5,33.8,2],
  [123.7,10.8,2.5],[122.5,10.5,2],
];

const SHIPS: [number, number, number, number][] = [
  [115, 20, 1, 10],
  [143, 35, 0.8, -15],
  [132, 28, 0.9, 25],
];

const RHUMB_CENTERS: [number, number][] = [[112, 30], [138, 18]];

function pathFrom(poly: LonLat[]): string {
  return poly.map(([lo, la], i) => {
    const [x, y] = project(lo, la);
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ") + " Z";
}

function labelXY(lon: number, lat: number) {
  const [x, y] = project(lon, lat);
  return { x: x.toFixed(1), y: y.toFixed(1) };
}

export function HomeMap({ trips }: { trips: Trip[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="relative rounded-lg p-[18px] overflow-hidden"
      style={{
        background: "#f6ecce",
        boxShadow:
          "0 1px 2px rgba(60,40,10,.08), 0 12px 32px rgba(60,40,10,.12), 0 0 0 3px #6b4a28, 0 0 0 5px #efe3c0, 0 0 0 8px #6b4a28",
      }}
    >
      <div className="relative aspect-[10/7] w-full rounded overflow-hidden bg-[#d9c99a]">
        <AntiqueChart />

        {/* Title card inside the map */}
        <div
          className="absolute top-6 left-6 border px-4 py-3 z-[5] max-w-[280px]"
          style={{ background: "#f6ecce", borderColor: "#6b4a28", boxShadow: "var(--shadow-soft)" }}
        >
          <div style={{ fontFamily: "'IM Fell English', serif", fontStyle: "italic", fontSize: 20, color: "#3a2817", letterSpacing: 1 }}>
            Chart of the Eastern Seas
          </div>
          <div style={{ fontFamily: "'IM Fell English', serif", fontSize: 11, color: "#8a6f4a", marginTop: 4, letterSpacing: 2, textTransform: "uppercase" }}>
            Anno Domini · MMXXVI
          </div>
          <div style={{ height: 1, background: "#8a6f4a", opacity: 0.4, margin: "8px 0" }} />
          <div style={{ fontFamily: "var(--font-hand)", fontSize: 16, color: "#5a4023" }}>
            家族航海圖 · {trips.length} locations
          </div>
        </div>

        {/* Pins */}
        {trips.map((t) => {
          const coords = KNOWN_COORDS[t.slug];
          if (!coords) return null;
          const [x, y] = project(coords[0], coords[1]);
          const left = (x / VB.w) * 100;
          const top = (y / VB.h) * 100;
          const active = hovered === t.slug;
          return (
            <Link
              key={t.slug}
              href={`/trips/${t.slug}`}
              onMouseEnter={() => setHovered(t.slug)}
              onMouseLeave={() => setHovered(null)}
              className="absolute z-10"
              style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -100%)" }}
              aria-label={t.title}
            >
              <div className="flex flex-col items-center">
                <div
                  className="px-3 py-1 mb-1 whitespace-nowrap transition-all"
                  style={{
                    fontFamily: "'IM Fell English', serif",
                    fontStyle: "italic",
                    fontSize: 17,
                    letterSpacing: 0.5,
                    background: active ? "#c24832" : "#f6ecce",
                    color: active ? "#f6ecce" : "#3a2817",
                    border: "1.5px solid #3a2817",
                    borderRadius: 2,
                    boxShadow: "var(--shadow-soft)",
                    transform: active ? "scale(1.08)" : "none",
                  }}
                >
                  {t.location} · {t.year}
                </div>
                <svg viewBox="0 0 28 34" width="26" height="32">
                  <path
                    d="M14 2 C 7 2 3 7 3 13 c 0 8 11 19 11 19 s 11 -11 11 -19 c 0 -6 -4 -11 -11 -11 z"
                    fill="#c24832"
                    stroke="#3a2817"
                    strokeWidth="1.5"
                  />
                  <circle cx="14" cy="13" r="4" fill="#f6ecce" stroke="#3a2817" strokeWidth="1" />
                  <circle cx="14" cy="13" r="1.5" fill="#3a2817" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function AntiqueChart() {
  const landPath = LAND.map(pathFrom).join(" ");
  const w = VB.w, h = VB.h;

  const waveLines: string[] = [];
  for (let r = 0; r < 18; r++) {
    const y = 40 + r * 38 + (r % 2 ? 8 : 0);
    for (let c = 0; c < 14; c++) {
      const x = 30 + c * 70 + (r % 2 ? 35 : 0);
      waveLines.push(`M ${x} ${y} q 5 -3 10 0 t 10 0`);
    }
  }

  const rhumbs = RHUMB_CENTERS.flatMap(([lo, la], ri) => {
    const [cx, cy] = project(lo, la);
    return [
      ...Array.from({ length: 16 }, (_, i) => {
        const a = (i * 22.5) * Math.PI / 180;
        const x2 = cx + Math.cos(a) * 420;
        const y2 = cy + Math.sin(a) * 420;
        return <line key={`r${ri}-${i}`} x1={cx} y1={cy} x2={x2.toFixed(1)} y2={y2.toFixed(1)} />;
      }),
      <circle key={`rc${ri}`} cx={cx} cy={cy} r={3} fill="#6b4a28" />,
    ];
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full block">
      <defs>
        <filter id="rough" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence baseFrequency="0.02" numOctaves={3} seed={7} />
          <feDisplacementMap in="SourceGraphic" scale={2} />
        </filter>
        <filter id="paperNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={4} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.2  0 0 0 0.15 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="60%" stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#3a2817" stopOpacity={0.35} />
        </radialGradient>
        <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfdfe6" />
          <stop offset="100%" stopColor="#a4c1ce" />
        </linearGradient>
        <pattern id="landTexture" width={8} height={8} patternUnits="userSpaceOnUse">
          <rect width={8} height={8} fill="#e6d19e" />
          <circle cx={2} cy={2} r={0.4} fill="#b8965a" opacity={0.5} />
          <circle cx={5} cy={6} r={0.4} fill="#b8965a" opacity={0.4} />
        </pattern>
      </defs>

      <rect width={w} height={h} fill="#efe3c0" />
      <rect width={w} height={h} fill="url(#seaGrad)" opacity={0.92} />

      <g stroke="#8a6f4a" strokeWidth={0.4} opacity={0.35} fill="none">{rhumbs}</g>
      <g stroke="#6a94a6" strokeWidth={0.6} fill="none" opacity={0.22} strokeLinecap="round">
        {waveLines.map((d, i) => <path key={i} d={d} />)}
      </g>

      <g stroke="#8a6f4a" strokeWidth={0.3} opacity={0.25} strokeDasharray="1 4" fill="none">
        {[10, 20, 30, 40].map(lat => {
          const [, y] = project(0, lat);
          return <line key={`lat${lat}`} x1={0} y1={y.toFixed(1)} x2={w} y2={y.toFixed(1)} />;
        })}
        {[100, 110, 120, 130, 140].map(lon => {
          const [x] = project(lon, 0);
          return <line key={`lon${lon}`} x1={x.toFixed(1)} y1={0} x2={x.toFixed(1)} y2={h} />;
        })}
      </g>

      {/* Coastline halo */}
      <g fill="none" stroke="#6b4a28" strokeWidth={6} opacity={0.18} strokeLinejoin="round"><path d={landPath} /></g>
      <g fill="none" stroke="#6b4a28" strokeWidth={3} opacity={0.28} strokeLinejoin="round"><path d={landPath} /></g>

      {/* Land shadow */}
      <g transform="translate(2.5,3)" fill="#a88648" opacity={0.55} filter="url(#rough)"><path d={landPath} /></g>

      {/* Land main */}
      <g fill="url(#landTexture)" stroke="#3a2817" strokeWidth={1.4} strokeLinejoin="round" filter="url(#rough)">
        <path d={landPath} />
      </g>

      {/* Islets */}
      <g fill="url(#landTexture)" stroke="#3a2817" strokeWidth={0.9}>
        {ISLETS.map(([lo, la, r], i) => {
          const [x, y] = project(lo, la);
          return <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} />;
        })}
      </g>

      {/* Mountain glyphs */}
      <g stroke="#3a2817" strokeWidth={0.8} fill="#c9a464" opacity={0.85}>
        {[[102,35],[108,37],[105,29],[112,32],[118,28],[96,30],[138,36],[141,39],[136,37],[133,35],[130,32],[128,37],[144,43],[127.5,26.5],[121,24]].map(([lo,la], i)=>{
          const [x,y] = project(lo,la);
          return <path key={i} d={`M ${x-6} ${y+3} L ${x-2} ${y-4} L ${x+2} ${y+1} L ${x+5} ${y-5} L ${x+9} ${y+3} Z`} />;
        })}
      </g>

      {/* Place labels */}
      <g fill="#3a2817" fontFamily="'IM Fell English', serif" fontStyle="italic" opacity={0.78}>
        <text {...labelXY(110,34)} textAnchor="middle" fontSize={26} letterSpacing={3}>CATHAY</text>
        <text {...labelXY(110,36)} textAnchor="middle" fontSize={11} letterSpacing={1.5} opacity={0.6}>( 中國 · China )</text>
        <text {...labelXY(138,38)} textAnchor="middle" fontSize={18} letterSpacing={2}>NIPPON</text>
        <text {...labelXY(138,39.4)} textAnchor="middle" fontSize={10} letterSpacing={1} opacity={0.6}>日本</text>
        <text {...labelXY(127.5,37.5)} textAnchor="middle" fontSize={12} letterSpacing={1.5}>COREA</text>
        <text {...labelXY(121,23.8)} textAnchor="middle" fontSize={11} letterSpacing={1.5}>FORMOSA</text>
        <text {...labelXY(122,15)} textAnchor="middle" fontSize={12} letterSpacing={1.5}>LUZON</text>
        <text {...labelXY(124,8)} textAnchor="middle" fontSize={11} letterSpacing={1.2}>MINDANAO</text>
        <text {...labelXY(109.5,19.3)} textAnchor="middle" fontSize={9} letterSpacing={1}>HAINAN</text>
        {(() => {
          const {x,y} = labelXY(106,13);
          return <text x={x} y={y} textAnchor="middle" fontSize={12} letterSpacing={1.5} transform={`rotate(-75 ${x} ${y})`}>INDO-CHINA</text>;
        })()}
      </g>

      {/* Sea labels */}
      <g fill="#2a4856" fontFamily="'IM Fell English', serif" fontStyle="italic" opacity={0.7}>
        <text {...labelXY(126,31)} textAnchor="middle" fontSize={14} letterSpacing={3}>East China Sea</text>
        <text {...labelXY(134,41.5)} textAnchor="middle" fontSize={14} letterSpacing={3}>Sea of Iapan</text>
        <text {...labelXY(144,29)} textAnchor="middle" fontSize={20} letterSpacing={8}>MARE PACIFICVM</text>
        <text {...labelXY(144,31)} textAnchor="middle" fontSize={10} letterSpacing={2} opacity={0.7}>— The Great Ocean —</text>
        <text {...labelXY(116,16)} textAnchor="middle" fontSize={13} letterSpacing={3}>South China Sea</text>
        <text {...labelXY(136,22)} textAnchor="middle" fontSize={10} letterSpacing={2} opacity={0.55}>— Philippine Sea —</text>
      </g>

      {/* Kraken */}
      {(() => { const [x,y] = project(140,15); return (
        <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} stroke="#3a2817" strokeWidth={1} fill="#7b5a3d" opacity={0.9}>
          <ellipse cx={0} cy={0} rx={18} ry={14} />
          <circle cx={-6} cy={-3} r={3} fill="#f6ecce" /><circle cx={-6} cy={-3} r={1.5} fill="#3a2817" />
          <circle cx={6} cy={-3} r={3} fill="#f6ecce" /><circle cx={6} cy={-3} r={1.5} fill="#3a2817" />
          <path d="M -16 4 Q -28 8 -34 -4 Q -36 -14 -26 -18" fill="none" strokeWidth={4} />
          <path d="M -8 10 Q -16 22 -6 28 Q 4 32 8 22" fill="none" strokeWidth={4} />
          <path d="M 8 10 Q 20 14 24 26 Q 26 36 16 38" fill="none" strokeWidth={4} />
          <path d="M 16 4 Q 30 0 34 -10 Q 34 -22 22 -22" fill="none" strokeWidth={4} />
          <path d="M 0 -12 Q 0 -22 10 -28 Q 22 -30 24 -20" fill="none" strokeWidth={3.5} />
          <g fill="none" stroke="#5a7a88" strokeWidth={0.8} opacity={0.5}>
            <ellipse cx={0} cy={2} rx={40} ry={10} />
            <ellipse cx={0} cy={2} rx={52} ry={13} />
          </g>
        </g>
      );})()}

      {/* Whale */}
      {(() => { const [x,y] = project(104,14); return (
        <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`} stroke="#3a2817" strokeWidth={1} fill="#6b4a28" opacity={0.88}>
          <path d="M -22 6 Q -10 -10 6 -8 Q 18 -6 22 4 L 14 6 Q 4 2 -4 4 Q -14 6 -22 6 Z" />
          <path d="M -22 6 Q -28 2 -32 -6 Q -30 -2 -26 2 Q -28 6 -32 10 Q -28 8 -24 8 Z" />
          <circle cx={12} cy={-2} r={1.5} fill="#f6ecce" /><circle cx={12} cy={-2} r={0.8} fill="#3a2817" />
          <path d="M 2 -8 Q -2 -18 0 -24 M 2 -8 Q 6 -18 8 -24 M 2 -8 Q 2 -16 3 -22" fill="none" stroke="#5a7a88" strokeWidth={1.2} opacity={0.7} />
          <g fill="none" stroke="#5a7a88" strokeWidth={0.7} opacity={0.5}>
            <ellipse cx={0} cy={8} rx={30} ry={6} />
            <ellipse cx={0} cy={8} rx={42} ry={9} />
          </g>
        </g>
      );})()}

      {/* Ships */}
      {SHIPS.map(([lo, la, s, rot], i) => {
        const [x, y] = project(lo, la);
        return (
          <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${s})`}>
            <path d="M -22 0 Q -18 8 0 9 Q 18 8 22 0 L 18 -2 L -18 -2 Z" fill="#6b4a28" stroke="#3a2817" strokeWidth={1} />
            <line x1={-18} y1={-2} x2={18} y2={-2} stroke="#3a2817" strokeWidth={0.6} />
            <line x1={-8} y1={-2} x2={-8} y2={-26} stroke="#3a2817" strokeWidth={1.2} />
            <line x1={8} y1={-2} x2={8} y2={-22} stroke="#3a2817" strokeWidth={1.2} />
            <path d="M -8 -26 Q -18 -18 -16 -6 L -8 -6 Z" fill="#f6ecce" stroke="#3a2817" strokeWidth={0.8} />
            <path d="M -8 -26 Q 2 -18 0 -6 L -8 -6 Z" fill="#f6ecce" stroke="#3a2817" strokeWidth={0.8} />
            <path d="M 8 -22 Q 0 -16 2 -6 L 8 -6 Z" fill="#f6ecce" stroke="#3a2817" strokeWidth={0.8} />
            <path d="M 8 -22 Q 16 -16 14 -6 L 8 -6 Z" fill="#f6ecce" stroke="#3a2817" strokeWidth={0.8} />
            <path d="M -8 -26 L -2 -27 L -4 -24 L -2 -22 L -8 -22 Z" fill="#c24832" stroke="#3a2817" strokeWidth={0.5} />
            <path d="M -25 2 Q -32 4 -38 2" stroke="#5a7a88" strokeWidth={0.8} fill="none" opacity={0.6} />
            <path d="M -25 -1 Q -32 -3 -38 -1" stroke="#5a7a88" strokeWidth={0.6} fill="none" opacity={0.5} />
          </g>
        );
      })}

      {/* Compass Rose */}
      <g transform={`translate(${w - 110} ${h - 120})`}>
        <circle r={70} fill="#f6ecce" stroke="#3a2817" strokeWidth={1.2} opacity={0.92} />
        <circle r={62} fill="none" stroke="#3a2817" strokeWidth={0.5} />
        <circle r={52} fill="none" stroke="#3a2817" strokeWidth={0.4} strokeDasharray="2 3" />
        <g stroke="#3a2817" strokeWidth={0.6}>
          {Array.from({ length: 32 }, (_, i) => {
            const a = i * 11.25 * Math.PI / 180;
            const r1 = i % 4 === 0 ? 52 : i % 2 === 0 ? 56 : 58;
            const r2 = 62;
            return <line key={i} x1={(Math.cos(a) * r1).toFixed(1)} y1={(Math.sin(a) * r1).toFixed(1)} x2={(Math.cos(a) * r2).toFixed(1)} y2={(Math.sin(a) * r2).toFixed(1)} />;
          })}
        </g>
        <g stroke="#3a2817" strokeWidth={0.8}>
          <path d="M 0 0 L 28 -28 L 4 -4 L 28 28 L 4 4 L -28 28 L -4 4 L -28 -28 L -4 -4 Z" fill="#e0c890" />
          <path d="M 0 -52 L 6 -4 L 0 0 L -6 -4 Z" fill="#c24832" />
          <path d="M 52 0 L 4 6 L 0 0 L 4 -6 Z" fill="#f6ecce" />
          <path d="M 0 52 L -6 4 L 0 0 L 6 4 Z" fill="#3a2817" />
          <path d="M -52 0 L -4 -6 L 0 0 L -4 6 Z" fill="#f6ecce" />
        </g>
        <g transform="translate(0 -60)" fill="#c24832" stroke="#3a2817" strokeWidth={0.6}>
          <path d="M 0 0 Q -4 -6 -2 -10 Q 0 -14 2 -10 Q 4 -6 0 0 Z" />
          <path d="M -3 -4 Q -7 -3 -6 -8 L -3 -6 Z M 3 -4 Q 7 -3 6 -8 L 3 -6 Z" />
          <line x1={-4} y1={-2} x2={4} y2={-2} strokeWidth={1} />
        </g>
        <g fontFamily="'IM Fell English', serif" fill="#3a2817" fontSize={13} fontStyle="italic">
          <text y={-76} textAnchor="middle">N</text>
          <text x={76} y={4} textAnchor="middle">E</text>
          <text y={82} textAnchor="middle">S</text>
          <text x={-76} y={4} textAnchor="middle">W</text>
        </g>
        <circle r={3} fill="#c24832" stroke="#3a2817" strokeWidth={0.5} />
      </g>

      {/* Scale bar */}
      <g transform={`translate(50 ${h - 60})`}>
        <text y={-16} fontFamily="'IM Fell English',serif" fontStyle="italic" fontSize={12} fill="#3a2817" opacity={0.75}>
          Scala Milliarium · Scale of Leagues
        </text>
        <g stroke="#3a2817" strokeWidth={0.8}>
          <rect x={0} y={-5} width={180} height={10} fill="#f6ecce" />
          <rect x={0} y={-5} width={30} height={10} fill="#3a2817" />
          <rect x={60} y={-5} width={30} height={10} fill="#3a2817" />
          <rect x={120} y={-5} width={30} height={10} fill="#3a2817" />
        </g>
        <g fontFamily="'IM Fell English',serif" fontSize={10} fill="#3a2817" opacity={0.85}>
          <text x={0} y={20} textAnchor="middle">0</text>
          <text x={60} y={20} textAnchor="middle">500</text>
          <text x={120} y={20} textAnchor="middle">1000</text>
          <text x={180} y={20} textAnchor="middle">km</text>
        </g>
      </g>

      {/* Cartouche */}
      <g transform={`translate(${w - 280} 40)`}>
        <path d="M 0 0 L 240 0 Q 250 0 250 10 L 250 70 Q 250 80 240 80 L 0 80 Q -10 80 -10 70 L -10 10 Q -10 0 0 0 Z"
              fill="#f6ecce" stroke="#3a2817" strokeWidth={1.2} />
        <g stroke="#3a2817" strokeWidth={1} fill="none">
          <path d="M -10 10 Q -18 10 -18 18 M 250 10 Q 258 10 258 18 M -10 70 Q -18 70 -18 62 M 250 70 Q 258 70 258 62" />
          <circle cx={-10} cy={10} r={2} fill="#c24832" />
          <circle cx={250} cy={10} r={2} fill="#c24832" />
          <circle cx={-10} cy={70} r={2} fill="#c24832" />
          <circle cx={250} cy={70} r={2} fill="#c24832" />
        </g>
        <text x={120} y={30} textAnchor="middle" fontFamily="'IM Fell English',serif" fontStyle="italic" fontSize={18} fill="#3a2817" letterSpacing={3}>Tabula Orientalis</text>
        <text x={120} y={50} textAnchor="middle" fontFamily="'IM Fell English',serif" fontSize={11} fill="#8a6f4a" letterSpacing={2}>VOYAGES OF THE FAMILY</text>
        <text x={120} y={68} textAnchor="middle" fontFamily="'IM Fell English',serif" fontSize={10} fill="#8a6f4a" letterSpacing={1.5} fontStyle="italic">MMXXVI</text>
      </g>

      {/* Paper noise + coffee stains + vignette */}
      <rect width={w} height={h} fill="#3a2817" opacity={0.05} filter="url(#paperNoise)" />
      <g opacity={0.18}>
        <circle cx={180} cy={560} r={40} fill="#6b4a28" />
        <circle cx={180} cy={560} r={32} fill="#8a6f4a" />
        <circle cx={820} cy={180} r={25} fill="#6b4a28" />
      </g>
      <rect width={w} height={h} fill="url(#vignette)" />
    </svg>
  );
}
