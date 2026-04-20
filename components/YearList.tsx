"use client";
import { useState } from "react";
import Link from "next/link";
import type { Trip } from "@/lib/types";

export function YearList({
  byYear,
  years,
}: {
  byYear: Record<number, Trip[]>;
  years: number[];
}) {
  const [openYear, setOpenYear] = useState<number | null>(years[0] ?? null);

  return (
    <aside className="bg-[var(--card-bg)] border border-[var(--rule)] rounded-2xl p-5 md:p-6 shadow-[var(--shadow-soft)] h-fit lg:sticky lg:top-8">
      <div className="flex items-end justify-between mb-4 md:mb-5">
        <div className="font-[family-name:var(--font-hand)] text-[20px] md:text-[22px] text-[var(--ink-faint)]">
          — 年份清單 —
        </div>
        <div className="font-serif text-[13px] text-[var(--ink-faint)]">
          共 {years.reduce((n, y) => n + byYear[y].length, 0)} 趟
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {years.length === 0 && (
          <div className="text-[var(--ink-faint)] text-sm">還沒有紀錄</div>
        )}
        {years.map((y) => {
          const trips = byYear[y];
          const isOpen = openYear === y;
          return (
            <div key={y} className="border-b border-dashed border-[var(--rule)] last:border-b-0">
              <button
                onClick={() => setOpenYear(isOpen ? null : y)}
                className="w-full flex items-center justify-between py-3 md:py-3 min-h-[52px] cursor-pointer text-left"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-serif font-black text-[28px] md:text-[32px] text-[var(--ink)] leading-none">
                    {y}
                  </span>
                  <span className="font-[family-name:var(--font-hand)] text-[var(--ink-faint)] text-base">
                    {trips.length} 趟
                  </span>
                </div>
                <span
                  className={`text-[var(--ink-faint)] transition-transform ${isOpen ? "rotate-90" : ""}`}
                >
                  ▸
                </span>
              </button>
              {isOpen && (
                <div className="pb-3 pl-1 flex flex-col gap-2.5">
                  {trips.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/trips/${t.slug}`}
                      className="group flex items-center justify-between gap-3 p-3.5 md:p-3 rounded-xl md:rounded-lg bg-[var(--paper)] hover:bg-[var(--coral)] hover:text-white active:scale-[0.99] transition-all no-underline min-h-[56px]"
                    >
                      <div className="min-w-0">
                        <div className="font-serif font-bold text-[15px] text-[var(--ink)] group-hover:text-white truncate">
                          {t.title}
                        </div>
                        <div className="text-xs text-[var(--ink-faint)] group-hover:text-white/80 mt-0.5">
                          {t.dateRangeLabel} · {t.location}
                        </div>
                      </div>
                      <span className="text-[var(--ink-faint)] group-hover:text-white shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-dashed border-[var(--rule)]">
        <div className="font-[family-name:var(--font-hand)] text-[var(--ink-faint)] text-sm">
          新增旅程 → 在 <code className="text-[var(--coral)]">content/trips/</code> 建立 .md
        </div>
      </div>
    </aside>
  );
}
