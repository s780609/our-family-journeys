import type { Day } from "@/lib/types";
import { StopBlock } from "./StopBlock";

export function DaySection({ day }: { day: Day }) {
  return (
    <section
      id={`day-${day.num}`}
      data-day-section
      data-screen-label={`Day ${day.num} - ${day.theme}`}
      className="day-section mb-20 relative scroll-mt-10"
    >
      <div className="day-header flex items-end gap-5 mb-8 pb-4 border-b-2 border-[var(--ink)] relative cursor-pointer select-none group">
        <div className="font-[family-name:var(--font-hand)] text-[120px] max-md:text-[80px] font-bold leading-[0.8] text-[var(--coral)] tracking-tight">
          D{day.num}
        </div>
        <div className="flex-1 pb-2">
          <div className="font-serif text-sm text-[var(--ink-faint)] tracking-widest uppercase mb-1">
            {day.dateFull}
          </div>
          <div className="font-serif font-bold text-[32px] max-md:text-2xl text-[var(--ink)] leading-snug">
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
        <div
          className="relative pl-14 max-md:pl-7 flex flex-col"
          style={{ gap: "var(--density-gap)" }}
        >
          <div
            className="absolute left-5 max-md:left-1 top-3 bottom-3 w-0.5 opacity-40"
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
