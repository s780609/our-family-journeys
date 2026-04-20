"use client";
import { useEffect, useState } from "react";
import { haptic } from "@/lib/mobile";

export type DayMeta = { id: string; label: string; date: string; title: string };

export function MobileNav({ days, tripTitle }: { days: DayMeta[]; tripTitle: string }) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hideTop, setHideTop] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      let cur = 0;
      days.forEach((d, i) => {
        const el = document.getElementById(d.id);
        if (el && el.offsetTop - 180 <= sy) cur = i;
      });
      setActive(cur);
      const total = document.documentElement.scrollHeight - vh;
      setProgress(total > 0 ? Math.min(100, (sy / total) * 100) : 0);
      // Auto-hide top bar when scrolling down past 200px
      if (sy > 200 && sy > lastY) setHideTop(true);
      else setHideTop(false);
      setLastY(sy);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [days, lastY]);

  const jump = (id: string) => {
    haptic("medium");
    setSheetOpen(false);
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" }), 120);
    }
  };

  return (
    <>
      {/* Top: back chip + day pill strip — auto-hides on scroll down */}
      <div
        className={`md:hidden sticky top-0 z-40 transition-transform duration-300 ${
          hideTop ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="bg-[var(--paper)]/92 backdrop-blur-md border-b border-[var(--rule)]">
          {/* Trip title strip — tiny */}
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
          {/* Day pills */}
          <div className="flex gap-1.5 overflow-x-auto px-3 pb-2 snap-x snap-mandatory scrollbar-hide">
            {days.map((d, i) => (
              <button
                key={d.id}
                onClick={() => jump(d.id)}
                className={`flex-none snap-start px-3 py-1.5 rounded-full border text-sm transition ${
                  i === active
                    ? "bg-[var(--ocean)] border-[var(--ocean)] text-white shadow-sm"
                    : "bg-[var(--card-bg)] border-[var(--rule)] text-[var(--ink)]"
                }`}
              >
                <span className="font-[family-name:var(--font-hand)] text-base leading-none mr-1.5">
                  {d.label}
                </span>
                <span className="text-[11px] font-bold opacity-80">{d.date}</span>
              </button>
            ))}
          </div>
          {/* Progress */}
          <div className="h-[2px] bg-[var(--rule)] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--coral)] to-[var(--sun)] transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom FAB — single big button, more prominent */}
      <button
        onClick={() => {
          haptic("medium");
          setSheetOpen(true);
        }}
        aria-label="跳到某天"
        className="md:hidden fixed right-4 z-50 bg-[var(--coral)] text-white rounded-full px-5 h-14 flex items-center gap-2 shadow-[0_8px_24px_rgba(217,104,80,0.45)] active:scale-95 transition"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5">
          <rect x={3} y={4} width={18} height={18} rx={2} />
          <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
        </svg>
        <span className="font-bold text-[15px]">跳到某天</span>
      </button>

      {/* Share FAB — secondary smaller */}
      <button
        onClick={async () => {
          haptic();
          const nav: any = navigator;
          if (nav.share) {
            try {
              await nav.share({ title: tripTitle, url: location.href });
            } catch {}
          } else {
            try {
              await navigator.clipboard.writeText(location.href);
              alert("連結已複製");
            } catch {}
          }
        }}
        aria-label="分享"
        className="md:hidden fixed left-4 z-50 bg-[var(--card-bg)] border border-[var(--rule)] text-[var(--ink)] rounded-full w-12 h-12 flex items-center justify-center shadow-[var(--shadow-soft)] active:scale-95 transition"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 17px)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path d="M12 3v12M8 7l4-4 4 4M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Spacer for FAB */}
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
