"use client";
import { useEffect, useState } from "react";
import type { Day } from "@/lib/types";

export function ScrollProgress({ days }: { days: { num: number; date: string; theme: string }[] }) {
  const [pct, setPct] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const p = docH > 0 ? Math.min(100, Math.max(0, (scrollTop / docH) * 100)) : 0;
      setPct(p);
      const mid = scrollTop + window.innerHeight * 0.35;
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-day-section]"));
      let idx = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= mid) idx = i;
      }
      setCurrent(idx);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  function go(n: number) {
    const el = document.getElementById(`day-${n}`);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const vh = window.innerHeight;
    const topOffset = 40;
    const available = vh - topOffset;
    const target =
      rect.height <= available
        ? sectionTop - topOffset - (available - rect.height) / 2
        : sectionTop - topOffset;
    window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
  }

  return (
    <>
      {/* top rail — desktop + mobile, thin at top */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[100]">
        <div
          className="h-full bg-gradient-to-r from-[var(--ocean)] via-[var(--coral)] to-[var(--sun)] transition-[width] duration-[120ms] ease-out shadow-[0_0_10px_rgba(217,104,80,0.4)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* sidebar rail — desktop only */}
      <aside className="sticky top-10 self-start max-h-[calc(100vh-80px)] flex flex-col pt-5 max-lg:hidden">
        <div className="font-[family-name:var(--font-hand)] text-[22px] text-[var(--ink-faint)] mb-6 tracking-wide">
          — 旅程時間軸 —
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div
            className="absolute left-[22px] top-3 bottom-3 w-0.5"
            style={{
              background:
                "repeating-linear-gradient(to bottom, var(--rule) 0 4px, transparent 4px 8px)",
            }}
          />
          {days.map((d, i) => {
            const active = i === current;
            const passed = i < current;
            return (
              <button
                key={d.num}
                onClick={() => go(d.num)}
                className={`relative block w-full text-left pl-[52px] pr-3 py-3.5 cursor-pointer transition-all rounded-lg mb-1 ${
                  active
                    ? "bg-[rgba(46,107,138,0.08)] text-[var(--ink)]"
                    : "text-[var(--ink-faint)] hover:bg-[rgba(217,104,80,0.06)] hover:text-[var(--ink-soft)]"
                }`}
              >
                <span
                  className={`absolute left-4 top-1/2 -translate-y-1/2 rounded-full transition-all ${
                    active
                      ? "w-4 h-4 bg-[var(--coral)] border-2 border-[var(--coral)] shadow-[0_0_0_4px_rgba(217,104,80,0.2)]"
                      : passed
                      ? "w-3.5 h-3.5 bg-[var(--ocean)] border-2 border-[var(--ocean)]"
                      : "w-3.5 h-3.5 bg-[var(--paper)] border-2 border-[var(--rule)]"
                  }`}
                />
                <div className="font-[family-name:var(--font-hand)] text-2xl font-semibold leading-none">
                  Day {d.num}
                </div>
                <div className="font-serif text-[13px] mt-0.5 opacity-80">{d.date}</div>
                <div
                  className={`font-serif text-xs mt-1 tracking-wide ${
                    active ? "text-[var(--coral)]" : "text-[var(--ink-faint)]"
                  }`}
                >
                  {d.theme}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-5 pt-5 border-t border-dashed border-[var(--rule)]">
          <div className="flex justify-between font-[family-name:var(--font-hand)] text-lg text-[var(--ink-faint)] mb-1.5">
            <span>行程進度</span>
            <span className="text-[var(--coral)] font-bold">{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 bg-[var(--paper-dark)] rounded-lg overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--ocean)] to-[var(--coral)] transition-[width] duration-200 ease-out rounded-lg"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}

// BackTop — desktop only now; mobile version lives inside MobileNav's FAB stack
export function BackTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`hidden md:flex fixed bottom-6 left-6 w-12 h-12 rounded-full bg-[var(--card-bg)] border border-[var(--rule)] items-center justify-center cursor-pointer shadow-[var(--shadow-soft)] transition-all z-[99] text-[var(--ink)] font-[family-name:var(--font-hand)] text-lg hover:bg-[var(--coral)] hover:text-white hover:border-[var(--coral)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
      }`}
      title="回頂部"
    >
      ↑
    </button>
  );
}

export function DayCollapseToggle() {
  useEffect(() => {
    const headers = document.querySelectorAll<HTMLElement>(".day-header");
    const handlers: Array<() => void> = [];
    headers.forEach((h) => {
      const handler = () => {
        const day = h.closest<HTMLElement>(".day-section");
        if (!day) return;
        day.classList.toggle("collapsed");
        const btn = h.querySelector<HTMLElement>(".day-toggle");
        if (btn) btn.textContent = day.classList.contains("collapsed") ? "+ 展開" : "— 收合";
      };
      h.addEventListener("click", handler);
      handlers.push(() => h.removeEventListener("click", handler));
    });
    return () => handlers.forEach((fn) => fn());
  }, []);
  return null;
}
