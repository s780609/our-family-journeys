import type { Budget } from "@/lib/types";

export function TripBudget({ budget }: { budget: Budget }) {
  return (
    <section className="mt-14 md:mt-20 relative p-5 md:p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--rule)] shadow-[var(--shadow-soft)]">
      <div
        className="absolute -top-2 left-8 w-24 h-5 opacity-85 shadow-sm -rotate-[6deg]"
        style={{ background: "#e8c870cc" }}
        aria-hidden
      />
      <div
        className="absolute -top-1 right-10 w-16 h-5 opacity-85 shadow-sm rotate-[8deg]"
        style={{ background: "#90c4d6cc" }}
        aria-hidden
      />

      <div className="flex items-baseline gap-2.5 mt-1">
        <span className="font-[family-name:var(--font-hand)] text-2xl md:text-[28px] text-[var(--coral)] -rotate-2">
          💰 預算
        </span>
        {budget.title && (
          <h3 className="font-serif font-black text-lg md:text-2xl text-[var(--ink)] leading-tight">
            {budget.title}
          </h3>
        )}
      </div>
      {budget.note && (
        <div className="font-[family-name:var(--font-hand)] text-sm md:text-base text-[var(--ink-faint)] mt-0.5 mb-4">
          {budget.note}
        </div>
      )}

      <ul className="flex flex-col divide-y divide-dashed divide-[var(--rule)]">
        {budget.items.map((it, i) => (
          <li key={i} className="py-2.5 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="text-[14px] md:text-[15px] text-[var(--ink-soft)] leading-snug">
                {it.label}
              </div>
              {it.note && (
                <div className="text-[11px] md:text-xs text-[var(--ink-faint)] leading-snug mt-0.5">
                  {it.note}
                </div>
              )}
            </div>
            <span className="font-serif font-bold text-[14px] md:text-[15px] text-[var(--ink)] shrink-0 tabular-nums whitespace-nowrap">
              {it.amount}
            </span>
          </li>
        ))}
      </ul>

      {budget.total && (
        <div className="mt-4 pt-4 border-t-2 border-[var(--ink)]">
          <div className="flex items-baseline justify-between gap-3">
            <span className="font-serif font-bold text-base md:text-lg text-[var(--ink)]">
              {budget.total.label}
            </span>
            <span className="font-serif font-black text-lg md:text-[26px] text-[var(--coral)] tabular-nums whitespace-nowrap">
              {budget.total.amount}
            </span>
          </div>
          {budget.total.note && (
            <div className="text-[11px] md:text-xs text-[var(--ink-faint)] mt-1 text-right">
              {budget.total.note}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
