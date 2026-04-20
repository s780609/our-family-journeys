import type { TripFrontmatter } from "@/lib/types";
import Link from "next/link";

export function TripHero({ trip }: { trip: TripFrontmatter }) {
  return (
    <header className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-[72px] pt-6 md:pt-16 pb-8 md:pb-12 z-[2]">
      {/* washi tape — desktop only */}
      <div
        className="hidden md:block absolute top-[30px] left-[40px] w-[120px] h-7 opacity-85 shadow-[0_1px_3px_rgba(0,0,0,0.08)] -rotate-[8deg]"
        style={{ background: "#90c4d6cc" }}
      />
      <div
        className="hidden md:block absolute top-[50px] right-[80px] w-[120px] h-7 opacity-85 shadow-[0_1px_3px_rgba(0,0,0,0.08)] rotate-[12deg]"
        style={{ background: "#e8a57acc" }}
      />

      <div className="hidden md:flex justify-between mb-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-hand)] text-[var(--ink-faint)] hover:text-[var(--coral)] text-lg transition-colors no-underline"
        >
          ← 回首頁
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-end gap-10 relative">
        <div className="relative">
          <div className="font-[family-name:var(--font-hand)] text-[28px] text-[var(--coral)] -rotate-2 inline-block mb-1">
            our family journey · no.01
          </div>
          <h1 className="font-serif font-black text-[clamp(48px,6.5vw,88px)] leading-[0.95] tracking-tight m-0 text-[var(--ink)]">
            {trip.title.replace(trip.year.toString(), "").trim().split(/\s+/)[0] || trip.title}
            <span className="relative inline-block text-[var(--ocean)]">
              <span className="relative z-[1]">
                {trip.title.replace(trip.year.toString(), "").trim().split(/\s+/).slice(1).join(" ") ||
                  trip.subtitle ||
                  ""}
              </span>
              <span
                className="absolute left-[-4%] right-[-4%] bottom-[6px] h-3.5 bg-[var(--sun)] opacity-55 rounded-full -z-0 -skew-x-[4deg] -rotate-1"
                aria-hidden
              />
            </span>
          </h1>
          {trip.subtitle && (
            <div className="font-[family-name:var(--font-hand)] text-[32px] text-[var(--ink-soft)] mt-3 -rotate-[0.5deg]">
              {trip.locationEn} · {trip.subtitle}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-1 p-5 border-2 border-[var(--coral)] text-[var(--coral)] rounded-full w-[150px] h-[150px] justify-center -rotate-[8deg] bg-white/30 font-[family-name:var(--font-hand)]">
          <div className="text-4xl font-bold leading-none">{trip.year}</div>
          <div className="font-serif font-bold text-sm tracking-widest uppercase">
            {trip.locationEn?.split(",")[0] || trip.location}
          </div>
          <div className="text-lg mt-0.5">{trip.dateRangeLabel}</div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-5 pt-7 border-t border-dashed border-[var(--rule)]">
        <MetaItem
          label="旅行天數"
          value={`${daysBetween(trip.startDate, trip.endDate) + 1} 天 ${daysBetween(trip.startDate, trip.endDate)} 夜`}
          sub={trip.dateRangeLabel}
        />
        {trip.members && (
          <MetaItem
            label="同行成員"
            value={`${trip.members.length} 組`}
            sub={trip.members.join(" · ")}
          />
        )}
        {trip.hotel && (
          <MetaItem label="住宿" value={trip.hotel.name} sub={trip.hotel.area} />
        )}
        {trip.transport && (
          <MetaItem label="交通" value={trip.transport.name} sub={trip.transport.note} />
        )}
      </div>
    </header>
  );
}

function MetaItem({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-hand)] text-lg text-[var(--ink-faint)] mb-0.5">
        {label}
      </div>
      <div className="font-serif font-bold text-xl text-[var(--ink)] leading-snug">{value}</div>
      {sub && <div className="text-[13px] text-[var(--ink-soft)] mt-0.5">{sub}</div>}
    </div>
  );
}

function daysBetween(a: string, b: string) {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}
