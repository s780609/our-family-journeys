"use client";
import { useEffect, useState } from "react";
import { haptic } from "@/lib/mobile";

export type DayMeta = { id: string; label: string; date: string; title: string };

export function MobileNav({ days, tripTitle, hasChecklist = false }: { days: DayMeta[]; tripTitle: string; hasChecklist?: boolean }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hideTop, setHideTop] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const total = document.documentElement.scrollHeight - vh;
      let cur = 0;
      days.forEach((d, i) => {
        const el = document.getElementById(d.id);
        if (el && el.offsetTop - 180 <= sy) cur = i;
      });
      setActive(cur);
      setScrolled(sy > 400);
      setProgress(total > 0 ? Math.min(100, (sy / total) * 100) : 0);
      if (sy > 200 && sy > lastY) setHideTop(true);
      else setHideTop(false);
      setLastY(sy);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [days, lastY]);

  const jump = (id: string) => {
    haptic("medium");
    setSheetOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const vh = window.innerHeight;
      const stickyOffset = 130;
      const available = vh - stickyOffset;
      const target =
        rect.height <= available
          ? sectionTop - stickyOffset - (available - rect.height) / 2
          : sectionTop - stickyOffset;
      window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
    }, 120);
  };

  const share = async () => {
    haptic();
    setFabOpen(false);
    const nav: any = navigator;
    if (nav.share) {
      try { await nav.share({ title: tripTitle, url: location.href }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(location.href); alert("連結已複製"); } catch {}
    }
  };

  const openChecklist = () => {
    haptic();
    setFabOpen(false);
    const el = document.getElementById("pre-trip-checklist");
    if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
  };

  const openTweaks = () => {
    haptic();
    setFabOpen(false);
    (window as any).__openTweaks?.();
  };

  const backTop = () => {
    haptic();
    setFabOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Top bar — back + title + day pills */}
      <div
        className={`md:hidden sticky top-0 z-40 transition-transform duration-300 ${
          hideTop ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-[var(--paper)]/92 backdrop-blur-md border-b border-[var(--rule)]">
          <div className="flex items-center gap-2 px-3 pt-2 pb-1">
            <a
              href="/"
              onClick={() => haptic()}
              aria-label="回首頁"
              className="shrink-0 w-9 h-9 rounded-full bg-[var(--card-bg)] border border-[var(--rule)] flex items-center justify-center text-[var(--ink)]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
                <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div className="min-w-0 flex-1">
              <div className="font-[family-name:var(--font-hand)] text-xs text-[var(--ink-faint)] leading-none">
                journey
              </div>
              <div className="font-serif font-bold text-[13px] text-[var(--ink)] truncate leading-tight">
                {tripTitle}
              </div>
            </div>
            <div className="shrink-0 font-[family-name:var(--font-hand)] text-[var(--coral)] text-sm">
              {active + 1}/{days.length}
            </div>
          </div>
          <div className="relative h-[54px] px-3">
            {/* rail background */}
            <div className="absolute left-3 right-3 bottom-[18px] h-[3px] rounded-full bg-[var(--paper-dark)]" />
            {/* rail filled portion */}
            <div
              className="absolute left-3 bottom-[18px] h-[3px] rounded-full bg-gradient-to-r from-[var(--coral)] to-[var(--sun)] transition-[width] duration-200"
              style={{ width: `calc((100% - 24px) * ${progress / 100})` }}
            />
            {/* day dots + labels */}
            {days.map((d, i) => {
              const p = days.length > 1 ? (i / (days.length - 1)) * 100 : 50;
              const curr = i === active;
              const passed = i < active;
              return (
                <button
                  key={d.id}
                  onClick={() => jump(d.id)}
                  aria-label={`跳到 ${d.label} · ${d.date}`}
                  className="absolute top-0 h-full flex flex-col items-center pt-1"
                  style={{
                    left: `calc(12px + (100% - 24px) * ${p / 100})`,
                    width: 44,
                    transform: "translateX(-50%)",
                  }}
                >
                  <span
                    className={`font-[family-name:var(--font-hand)] text-[12px] leading-none tracking-wide transition-colors ${
                      curr
                        ? "text-[var(--coral)] font-bold"
                        : passed
                        ? "text-[var(--ocean)]"
                        : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {d.label}
                  </span>
                  <span
                    className={`absolute rounded-full transition-all ${
                      curr
                        ? "bottom-[11px] w-[14px] h-[14px] bg-[var(--coral)] shadow-[0_0_0_4px_rgba(217,104,80,0.25)]"
                        : passed
                        ? "bottom-[12px] w-3 h-3 bg-[var(--ocean)]"
                        : "bottom-[12px] w-3 h-3 bg-[var(--paper)] border-2 border-[var(--rule)]"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══════════ FAB Stack — right-bottom, vertical ═══════════ */}
      <div
        className="md:hidden fixed right-4 z-50 flex flex-col items-end gap-2.5"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        {/* Small secondary FABs — reveal when fabOpen */}
        <div
          className={`flex flex-col items-end gap-2.5 transition-all duration-200 origin-bottom-right ${
            fabOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-2 pointer-events-none"
          }`}
        >
          {scrolled && (
            <MiniFab label="回頂部" onClick={backTop}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
                <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MiniFab>
          )}
          {hasChecklist && (
            <MiniFab label="行前清單" onClick={openChecklist}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                <rect x={4} y={4} width={16} height={16} rx={2} />
                <path d="M8 10l2 2 4-4M8 16h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MiniFab>
          )}
          <MiniFab label="分享" onClick={share}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <path d="M12 3v12M8 7l4-4 4 4M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </MiniFab>
          <MiniFab label="主題" onClick={openTweaks}>
            <span className="font-[family-name:var(--font-hand)] text-xl leading-none">✎</span>
          </MiniFab>
        </div>

        {/* Main FAB group — jump day + toggle more */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              haptic("light");
              setFabOpen((o) => !o);
            }}
            aria-label={fabOpen ? "收合" : "更多"}
            className={`w-12 h-12 rounded-full bg-[var(--card-bg)] border border-[var(--rule)] text-[var(--ink)] flex items-center justify-center shadow-[var(--shadow-soft)] active:scale-95 transition ${
              fabOpen ? "rotate-45 bg-[var(--paper-dark)]" : ""
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => {
              haptic("medium");
              setSheetOpen(true);
            }}
            aria-label="跳到某天"
            className="bg-[var(--coral)] text-white rounded-full pl-4 pr-5 h-14 flex items-center gap-2 shadow-[0_8px_24px_rgba(217,104,80,0.45)] active:scale-95 transition"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
              <rect x={3} y={4} width={18} height={18} rx={2} />
              <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
            </svg>
            <span className="font-bold text-[15px]">跳到某天</span>
          </button>
        </div>
      </div>

      {/* Scrim for fabOpen */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity ${
          fabOpen ? "opacity-100 bg-black/10 backdrop-blur-[1px]" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setFabOpen(false)}
      />

      {/* Spacer */}
      <div className="md:hidden" style={{ height: "calc(80px + env(safe-area-inset-bottom))" }} />

      {/* Day jump sheet */}
      <div
        className={`md:hidden fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm transition-opacity ${
          sheetOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSheetOpen(false)}
      />
      <div
        className={`md:hidden fixed left-0 right-0 bottom-0 z-[100] bg-[var(--paper)] rounded-t-[28px] shadow-2xl transition-transform duration-300 max-h-[80vh] overflow-y-auto ${
          sheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
      >
        <div className="w-10 h-1 bg-[var(--rule)] rounded-full mx-auto my-3" />
        <h3 className="text-center font-serif font-black text-2xl mb-1">跳到哪一天?</h3>
        <div className="text-center font-[family-name:var(--font-hand)] text-lg text-[var(--ink-faint)] mb-4">
          — which day? —
        </div>
        <div className="flex flex-col gap-2 px-4">
          {days.map((d, i) => (
            <button
              key={d.id}
              onClick={() => jump(d.id)}
              className={`min-h-[64px] px-4 py-3 rounded-2xl border flex items-center gap-3 text-left transition ${
                i === active
                  ? "bg-[var(--ocean)] border-[var(--ocean)] text-white"
                  : "bg-[var(--card-bg)] border-[var(--rule)]"
              }`}
            >
              <div
                className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-[family-name:var(--font-hand)] text-xl ${
                  i === active ? "bg-white/20 text-white" : "bg-[var(--coral)] text-white"
                }`}
              >
                {d.label.replace(/\D/g, "")}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-serif font-bold text-base leading-tight truncate ${i === active ? "text-white" : "text-[var(--ink)]"}`}>
                  {d.title}
                </div>
                <div className={`text-xs font-bold mt-0.5 ${i === active ? "text-white/80" : "text-[var(--ink-faint)]"}`}>
                  {d.date}
                </div>
              </div>
              <span className={i === active ? "text-white" : "text-[var(--ink-faint)]"}>→</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function MiniFab({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center gap-2 pl-3.5 pr-4 h-11 rounded-full bg-[var(--card-bg)] border border-[var(--rule)] text-[var(--ink)] shadow-[var(--shadow-soft)] active:scale-95 transition"
    >
      {children}
      <span className="font-serif font-bold text-sm">{label}</span>
    </button>
  );
}
