"use client";
import { useEffect, useState } from "react";

type Palette = "ocean" | "sunset" | "jungle" | "plum";
type Font = "handwritten" | "modern";
type Density = "tight" | "normal" | "loose";
type Theme = "day" | "night";

const PALETTES: Record<Palette, Record<string, string>> = {
  ocean: { "--ocean": "#2e6b8a", "--ocean-deep": "#1d4a63", "--coral": "#d96850", "--coral-soft": "#e89478", "--sun": "#e8b04a" },
  sunset: { "--ocean": "#c24a3a", "--ocean-deep": "#8a2e20", "--coral": "#e89478", "--coral-soft": "#f0b098", "--sun": "#f0c06a" },
  jungle: { "--ocean": "#5a7a3d", "--ocean-deep": "#3d5828", "--coral": "#d96850", "--coral-soft": "#e89478", "--sun": "#e8b04a" },
  plum: { "--ocean": "#8e5a7a", "--ocean-deep": "#5a3850", "--coral": "#d96850", "--coral-soft": "#e89478", "--sun": "#e8b04a" },
};

const SWATCH: Record<Palette, string> = {
  ocean: "#2e6b8a",
  sunset: "#d96850",
  jungle: "#6b8e4e",
  plum: "#8e5a7a",
};

export function TweaksPanel() {
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState<Palette>("ocean");
  const [font, setFont] = useState<Font>("handwritten");
  const [density, setDensity] = useState<Density>("normal");
  const [theme, setTheme] = useState<Theme>("day");

  useEffect(() => {
    const saved = localStorage.getItem("tweaks");
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.palette) setPalette(s.palette);
        if (s.font) setFont(s.font);
        if (s.density) setDensity(s.density);
        if (s.theme) setTheme(s.theme);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const p = PALETTES[palette];
    for (const k in p) document.documentElement.style.setProperty(k, p[k]);
  }, [palette]);

  useEffect(() => {
    if (font === "modern") {
      document.documentElement.style.setProperty("--font-serif", '"Noto Sans TC", system-ui, sans-serif');
      document.documentElement.style.setProperty("--font-hand", '"Noto Sans TC", system-ui, sans-serif');
    } else {
      document.documentElement.style.setProperty("--font-serif", '"Noto Serif TC", "Shippori Mincho", serif');
      document.documentElement.style.setProperty("--font-hand", '"Caveat", "Kalam", "Noto Serif TC", cursive');
    }
  }, [font]);

  useEffect(() => {
    document.documentElement.setAttribute("data-density", density);
  }, [density]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("tweaks", JSON.stringify({ palette, font, density, theme }));
  }, [palette, font, density, theme]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--card-bg)] border border-[var(--rule)] flex items-center justify-center cursor-pointer shadow-[var(--shadow-soft)] z-[201] text-[var(--ink)] font-[family-name:var(--font-hand)] text-xl hover:bg-[var(--coral)] hover:text-white hover:border-[var(--coral)]"
        title="Tweaks"
      >
        ✎
      </button>
      {open && (
        <div className="fixed bottom-[84px] right-6 w-[280px] bg-[var(--card-bg)] border border-[var(--rule)] rounded-2xl p-5 shadow-[var(--shadow-lift)] z-[200] font-serif">
          <div className="font-[family-name:var(--font-hand)] text-[22px] text-[var(--ink)] mb-3.5">
            ✎ Tweaks
          </div>
          <Row label="主色調">
            <div className="flex gap-1.5">
              {(Object.keys(PALETTES) as Palette[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPalette(p)}
                  className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${
                    palette === p ? "border-[var(--ink)] scale-110" : "border-transparent"
                  }`}
                  style={{ background: SWATCH[p] }}
                />
              ))}
            </div>
          </Row>
          <Row label="字型質感">
            <Segs
              options={[
                ["handwritten", "手作感"],
                ["modern", "現代感"],
              ]}
              value={font}
              onChange={(v) => setFont(v as Font)}
            />
          </Row>
          <Row label="卡片密度">
            <Segs
              options={[
                ["tight", "密"],
                ["normal", "適中"],
                ["loose", "疏"],
              ]}
              value={density}
              onChange={(v) => setDensity(v as Density)}
            />
          </Row>
          <Row label="模式">
            <Segs
              options={[
                ["day", "☀ 日"],
                ["night", "☾ 夜"],
              ]}
              value={theme}
              onChange={(v) => setTheme(v as Theme)}
            />
          </Row>
        </div>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5">
      <div className="text-xs text-[var(--ink-faint)] tracking-wider uppercase mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function Segs<T extends string>({
  options,
  value,
  onChange,
}: {
  options: [T, string][];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex bg-[var(--paper)] rounded-full p-[3px] text-[13px]">
      {options.map(([k, label]) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={`flex-1 px-2.5 py-1.5 text-center rounded-full cursor-pointer transition-all ${
            value === k ? "bg-[var(--coral)] text-white" : "text-[var(--ink-faint)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
