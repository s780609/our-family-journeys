"use client";
import { useEffect, useState } from "react";
import { haptic } from "@/lib/mobile";

export type DayMeta = { id: string; label: string; date: string; title: string };

export function MobileNav({
  days,
  tripTitle,
  location,
  dateRangeLabel,
}: {
  days: DayMeta[];
  tripTitle: string;
  location: string;
  dateRangeLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const getHeaderOffset = () => {
    const el = document.getElementById("mobile-sticky-header");
    return (el?.getBoundingClientRect().height ?? 150) + 8;
  };

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      const offset = getHeaderOffset();
      let cur = 0;
      days.forEach((d, i) => {
        const el = document.getElementById(d.id);
        if (el && el.offsetTop - offset - 4 <= sy) cur = i;
      });
      setActive(cur);
      const total = document.documentElement.scrollHeight - vh;
      setProgress(total > 0 ? Math.min(100, (sy / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [days]);

  const jump = (id: string) => {
    haptic("medium");
    setSheetOpen(false);
    const el = document.getElementById(id);
    if (el) {
      setTimeout(() => {
        const offset = getHeaderOffset();
        window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
      }, 120);
    }
  };

  const locationShort = location.split(/\s+/)[0];

  return (
    <>
      {/* Sticky mobile header — top bar + day strip */}
      <div
        id="mobile-sticky-header"
        className="md:hidden sticky top-0 z-40 bg-[var(--paper)]/95 backdrop-blur border-b border-[var(--rule)]"
      >
        {/* Top bar: back + title + switch home */}
        <div className="flex items-center justify-between gap-2.5 px-3 pt-2.5 pb-2">
          <a
            href="/"
            onClick={() => haptic()}
            className="flex items-center gap-2.5 min-w-0 flex-1 no-underline"
          >
            <span className="flex-none w-9 h-9 rounded-full border border-[var(--rule)] bg-[var(--card-bg)] flex items-center justify-center text-[var(--ink)]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </span>
            <span className="min-w-0 flex flex-col">
              <span className="text-[11px] text-[var(--ink-faint)] leading-tight truncate">
                {locationShort} · {dateRangeLabel}
              </span>
              <span className="font-serif font-bold text-[15px] text-[var(--ink)] leading-tight truncate">
                {tripTitle}
              </span>
            </span>
          </a>
          <a
            href="/"
            onClick={() => haptic()}
            className="flex-none px-3.5 h-9 rounded-full bg-[var(--ocean)] text-white text-xs font-bold flex items-center no-underline"
          >
            切換到首頁
          </a>
        </div>

        {/* Day cards strip */}
        <div className="flex gap-2 overflow-x-auto px-3 pb-2.5 snap-x snap-mandatory scrollbar-hide">
          {days.map((d, i) => {
            const isActive = i === active;
            return (
              <button
                key={d.id}
                onClick={() => {
                  haptic();
                  jump(d.id);
                }}
                className={`flex-none snap-center w-[88px] h-[90px] rounded-2xl border flex flex-col justify-between p-2.5 transition shadow-sm ${
                  isActive
                    ? "bg-[var(--ocean)] border-[var(--ocean)] text-white"
                    : "bg-white border-[var(--rule)] text-[var(--ink)]"
                }`}
              >
                <div
                  className={`font-[family-name:var(--font-hand)] text-[22px] leading-none text-left ${
                    isActive ? "text-white" : "text-[var(--ocean)]"
                  }`}
                >
                  {d.label}
                </div>
                <div className="text-left">
                  <div className={`text-[13px] font-bold leading-tight ${isActive ? "text-white" : "text-[var(--ink)]"}`}>
                    {d.date}
                  </div>
                  <div
                    className={`text-[10px] leading-tight mt-0.5 truncate ${
                      isActive ? "text-white/85" : "text-[var(--ink-faint)]"
                    }`}
                  >
                    {d.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* progress */}
        <div className="h-[3px] bg-[var(--rule)] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--coral)] to-[var(--sun)] transition-[width] duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom nav */}
      <div
        className="md:hidden fixed left-0 right-0 bottom-0 z-50 grid grid-cols-3 gap-2.5 px-3 pt-2.5 border-t border-[var(--rule)] bg-[var(--paper)]/95 backdrop-blur"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 10px)" }}
      >
        <a
          href="/"
          onClick={() => haptic()}
          className="min-h-[52px] rounded-2xl border border-[var(--rule)] bg-[var(--card-bg)] flex flex-col items-center justify-center gap-0.5 no-underline text-[var(--ink)]"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M3 12l9-9 9 9M5 10v10h14V10" />
          </svg>
          <span className="text-xs font-bold">首頁</span>
        </a>
        <button
          onClick={() => {
            haptic("medium");
            setSheetOpen(true);
          }}
          className="min-h-[52px] rounded-2xl bg-[var(--coral)] text-white flex flex-col items-center justify-center gap-0.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <rect x={3} y={4} width={18} height={18} rx={2} />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          <span className="text-xs font-bold">跳到某天</span>
        </button>
        <button
          onClick={async () => {
            haptic();
            const nav: any = navigator;
            if (nav.share) {
              try {
                await nav.share({ title: tripTitle, url: window.location.href });
              } catch {}
            } else {
              try {
                await navigator.clipboard.writeText(window.location.href);
                alert("連結已複製");
              } catch {}
            }
          }}
          className="min-h-[52px] rounded-2xl border border-[var(--rule)] bg-[var(--card-bg)] flex flex-col items-center justify-center gap-0.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <circle cx={18} cy={5} r={3} />
            <circle cx={6} cy={12} r={3} />
            <circle cx={18} cy={19} r={3} />
            <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
          </svg>
          <span className="text-xs font-bold">分享</span>
        </button>
      </div>

      {/* Spacer so content clears bottom nav */}
      <div className="md:hidden" style={{ height: "calc(84px + env(safe-area-inset-bottom))" }} />

      {/* Day jump sheet */}
      <div
        className={`md:hidden fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm transition-opacity ${
          sheetOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSheetOpen(false)}
      />
      <div
        className={`md:hidden fixed left-0 right-0 bottom-0 z-[100] bg-[var(--paper)] rounded-t-3xl shadow-2xl transition-transform duration-300 ${
          sheetOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)" }}
      >
        <div className="w-10 h-1 bg-[var(--rule)] rounded-full mx-auto my-2.5" />
        <h3 className="text-center font-bold text-xl mb-3">跳到哪一天?</h3>
        <div className="flex flex-col gap-2 px-4">
          {days.map((d) => (
            <button
              key={d.id}
              onClick={() => jump(d.id)}
              className="min-h-[60px] px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--rule)] flex justify-between items-center text-left"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-[family-name:var(--font-hand)] text-xl text-[var(--ocean)] leading-none">
                  {d.label}
                </span>
                <span className="font-bold text-sm">{d.title}</span>
              </div>
              <span className="text-xs text-[var(--ink-faint)] font-bold">{d.date}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
