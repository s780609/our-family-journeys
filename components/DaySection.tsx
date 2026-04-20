import type { Day } from "@/lib/types";
import { StopBlock } from "./StopBlock";

export function DaySection({ day }: { day: Day }) {
  return (
    <section
      id={`day-${day.num}`}
      data-day-section
      data-screen-label={`Day ${day.num} - ${day.theme}`}
      className="day-section mb-14 md:mb-20 relative scroll-mt-[130px] md:scroll-mt-10"
    >
      {/* Mobile header — horizontal pill bar */}
      <div className="md:hidden day-header flex items-center gap-3 mb-5 cursor-pointer select-none">
        <div className="shrink-0 w-14 h-14 rounded-2xl bg-[var(--coral)] text-white flex flex-col items-center justify-center shadow-[var(--shadow-soft)]">
          <span className="font-[family-name:var(--font-hand)] text-[28px] leading-none">D{day.num}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif text-[11px] text-[var(--ink-faint)] tracking-[0.15em] uppercase leading-tight">
            {day.dateFull}
          </div>
          <div className="font-serif font-black text-xl text-[var(--ink)] leading-tight truncate">
            {day.theme}
          </div>
          {day.sub && (
            <div className="font-[family-name:var(--font-hand)] text-base text-[var(--ink-soft)] leading-tight truncate">
              {day.sub}
            </div>
          )}
        </div>
        <button
          type="button"
          aria-label="收合"
          className="day-toggle shrink-0 w-9 h-9 rounded-full border border-[var(--rule)] bg-[var(--card-bg)] text-[var(--ink-faint)] flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Desktop header — keep original giant D1/D2 */}
      <div className="hidden md:flex day-header items-end gap-5 mb-8 pb-4 border-b-2 border-[var(--ink)] relative cursor-pointer select-none group">
        <div className="font-[family-name:var(--font-hand)] text-[120px] font-bold leading-[0.8] text-[var(--coral)] tracking-tight">
          D{day.num}
        </div>
        <div className="flex-1 pb-2">
          <div className="font-serif text-sm text-[var(--ink-faint)] tracking-widest uppercase mb-1">
            {day.dateFull}
          </div>
          <div className="font-serif font-bold text-[32px] text-[var(--ink)] leading-snug">
            {day.theme}
          </div>
          {day.sub && (
            <div className="font-[family-name:var(--font-hand)] text-[22px] text-[var(--ink-soft)] mt-0.5">
              {day.sub}
            </div>
          )}
        </div>
        <button
          type="button"
          className="day-toggle px-3.5 py-1.5 font-[family-name:var(--font-hand)] text-lg text-[var(--ink-faint)] border border-[var(--rule)] rounded-full bg-transparent cursor-pointer transition-all opacity-60 group-hover:opacity-100 hover:bg-[var(--paper-dark)] hover:text-[var(--ink)]"
        >
          — 收合
        </button>
      </div>

      <div className="day-content">
        {/* Mobile: no indent, no timeline rail — cards are full-bleed */}
        <div className="md:hidden flex flex-col gap-5">
          {day.stops.map((stop, i) => (
            <StopBlock key={i} stop={stop} />
          ))}
        </div>

        {/* Desktop: original rail + dots */}
        <div
          className="hidden md:flex relative pl-14 flex-col"
          style={{ gap: "var(--density-gap)" }}
        >
          <div
            className="absolute left-5 top-3 bottom-3 w-0.5 opacity-40"
            style={{
              background:
                "repeating-linear-gradient(to bottom, var(--ocean) 0 6px, transparent 6px 12px)",
            }}
          />
          {day.stops.map((stop, i) => (
            <StopBlock key={i} stop={stop} />
          ))}
        </div>
      </div>
    </section>
  );
}
