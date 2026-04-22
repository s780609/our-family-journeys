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

/**
 * TweaksPanel is now shared between desktop & mobile but renders its TRIGGER
 * differently: desktop shows the floating ✎ button bottom-right; mobile hides
 * the trigger entirely — instead, MobileNav calls `window.__openTweaks()`
 * from its FAB stack to show the sheet.
 */
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
    // expose opener for MobileNav
    (window as any).__openTweaks = () => setOpen(true);
    return () => {
      delete (window as any).__openTweaks;
    };
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
      {/* Desktop-only trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="hidden md:flex fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--card-bg)] border border-[var(--rule)] items-center justify-center cursor-pointer shadow-[var(--shadow-soft)] z-[201] text-[var(--ink)] font-[family-name:var(--font-hand)] text-xl hover:bg-[var(--coral)] hover:text-white hover:border-[var(--coral)]"
        title="Tweaks"
      >
        ✎
      </button>

      {/* Desktop popup panel */}
      {open && (
        <div className="hidden md:block fixed bottom-[84px] right-6 w-[280px] bg-[var(--card-bg)] border border-[var(--rule)] rounded-2xl p-5 shadow-[var(--shadow-lift)] z-[200] font-serif">
          <PanelBody
            palette={palette} setPalette={setPalette}
            font={font} setFont={setFont}
            density={density} setDensity={setDensity}
            theme={theme} setTheme={setTheme}
          />
        </div>
      )}

      {/* Mobile bottom sheet */}
      <div
        className={`md:hidden fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`md:hidden fixed left-0 right-0 bottom-0 z-[201] bg-[var(--card-bg)] rounded-t-[28px] shadow-2xl transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
      >
        <div className="w-10 h-1 bg-[var(--rule)] rounded-full mx-auto my-3" />
        <div className="flex items-center justify-between px-5 mb-3">
          <div className="font-[family-name:var(--font-hand)] text-[26px] text-[var(--ink)]">
            ✎ Tweaks
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-9 h-9 rounded-full bg-[var(--paper)] border border-[var(--rule)] flex items-center justify-center text-[var(--ink-faint)]"
          >
            ✕
          </button>
        </div>
        <div className="px-5">
          <PanelBody
            palette={palette} setPalette={setPalette}
            font={font} setFont={setFont}
            density={density} setDensity={setDensity}
            theme={theme} setTheme={setTheme}
          />
        </div>
      </div>
    </>
  );
}

function PanelBody({
  palette, setPalette, font, setFont, density, setDensity, theme, setTheme,
}: {
  palette: Palette; setPalette: (v: Palette) => void;
  font: Font; setFont: (v: Font) => void;
  density: Density; setDensity: (v: Density) => void;
  theme: Theme; setTheme: (v: Theme) => void;
}) {
  return (
    <>
      <Row label="主色調">
        <div className="flex gap-2">
          {(Object.keys(PALETTES) as Palette[]).map((p) => (
            <button
              key={p}
              onClick={() => setPalette(p)}
              className={`w-9 h-9 md:w-7 md:h-7 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${
                palette === p ? "border-[var(--ink)] scale-110" : "border-transparent"
              }`}
              style={{ background: SWATCH[p] }}
            />
          ))}
        </div>
      </Row>
      <Row label="字型質感">
        <Segs options={[["handwritten", "手作感"], ["modern", "現代感"]]} value={font} onChange={(v) => setFont(v as Font)} />
      </Row>
      <Row label="卡片密度">
        <Segs options={[["tight", "密"], ["normal", "適中"], ["loose", "疏"]]} value={density} onChange={(v) => setDensity(v as Density)} />
      </Row>
      <Row label="模式">
        <Segs options={[["day", "☀ 日"], ["night", "☾ 夜"]]} value={theme} onChange={(v) => setTheme(v as Theme)} />
      </Row>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-xs text-[var(--ink-faint)] tracking-wider uppercase mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function Segs<T extends string>({ options, value, onChange }: { options: [T, string][]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex bg-[var(--paper)] rounded-full p-[3px] text-[13px]">
      {options.map(([k, label]) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={`flex-1 px-3 py-2 md:py-1.5 text-center rounded-full cursor-pointer transition-all ${
            value === k ? "bg-[var(--coral)] text-white" : "text-[var(--ink-faint)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
