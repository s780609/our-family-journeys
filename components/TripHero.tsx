import type { TripFrontmatter } from "@/lib/types";
import { resolveTripMode } from "@/lib/trips";
import Link from "next/link";

export function TripHero({ trip }: { trip: TripFrontmatter }) {
  const nights = daysBetween(trip.startDate, trip.endDate);
  const days = nights + 1;
  const mode = resolveTripMode(trip);
  const modeBadge =
    mode === "planning"
      ? { text: "規劃中", cls: "bg-[var(--sun)] text-[var(--ink)]" }
      : mode === "ongoing"
      ? { text: "進行中", cls: "bg-[var(--ocean)] text-white" }
      : { text: "旅程紀錄", cls: "bg-[var(--leaf)] text-white" };

  return (
    <header className="relative max-w-[1400px] mx-auto z-[2]">
      {/* ═══════════════ MOBILE HERO — passport stamp style ═══════════════ */}
      <div className="md:hidden px-5 pt-4 pb-6">
        {/* Passport stamp card */}
        <div
          className="relative rounded-2xl p-5 border-[1.5px] border-[var(--ink)] bg-[var(--card-bg)] shadow-[var(--shadow-soft)] overflow-hidden"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, transparent 0 18px, rgba(45,36,25,0.04) 18px 19px)",
          }}
        >
          {/* washi tape */}
          <div
            className="absolute -top-2 left-6 w-24 h-6 opacity-85 shadow-sm -rotate-[8deg]"
            style={{ background: "#90c4d6cc" }}
            aria-hidden
          />
          <div
            className="absolute -top-1 right-6 w-20 h-6 opacity-85 shadow-sm rotate-[10deg]"
            style={{ background: "#e8a57acc" }}
            aria-hidden
          />

          <div className="font-[family-name:var(--font-hand)] text-[18px] text-[var(--coral)] -rotate-1 inline-block mb-1 mt-2">
            our family journey · no.01
          </div>
          <span
            className={`inline-block font-[family-name:var(--font-hand)] text-[13px] px-2 py-0.5 rounded-xl -rotate-2 mb-2 ml-2 ${modeBadge.cls}`}
          >
            {modeBadge.text}
          </span>

          <h1 className="font-serif font-black text-[38px] leading-[1] tracking-tight m-0 text-[var(--ink)]">
            {trip.title}
          </h1>

          {trip.subtitle && (
            <div className="font-[family-name:var(--font-hand)] text-[22px] text-[var(--ink-soft)] mt-1.5 leading-tight">
              {trip.locationEn} · {trip.subtitle}
            </div>
          )}

          {/* Stamp badge — year */}
          <div
            className="absolute right-4 bottom-4 w-[72px] h-[72px] rounded-full border-[2.5px] border-[var(--coral)] text-[var(--coral)] flex flex-col items-center justify-center -rotate-[8deg] bg-white/40"
            style={{
              boxShadow: "inset 0 0 0 2px rgba(217,104,80,0.15)",
            }}
          >
            <div className="font-[family-name:var(--font-hand)] text-[28px] font-bold leading-none">
              {trip.year}
            </div>
            <div className="font-serif text-[9px] tracking-[0.15em] uppercase font-bold">
              {trip.locationEn?.split(",")[0]?.slice(0, 8) || trip.location}
            </div>
          </div>

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-dashed border-[var(--rule)]">
            <MobileStat label="天數" value={`${days}天${nights}夜`} />
            <MobileStat label="日期" value={trip.dateRangeLabel} />
            <MobileStat label="成員" value={`${trip.members?.length ?? 0} 組`} />
          </div>
        </div>

        {/* Secondary meta strip — hotel + transport */}
        {(trip.hotel || trip.transport) && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {trip.hotel && (
              <MetaChip
                icon="🏨"
                label={trip.hotel.name}
                sub={`${trip.hotel.area} · ${trip.hotel.nights}晚`}
              />
            )}
            {trip.transport && (
              <MetaChip icon="🚗" label={trip.transport.name} sub={trip.transport.note} />
            )}
          </div>
        )}
      </div>

      {/* ═══════════════ DESKTOP HERO — original ═══════════════ */}
      <div className="hidden md:block px-8 md:px-16 lg:px-[72px] pt-16 pb-12">
        {/* washi tape */}
        <div
          className="absolute top-[30px] left-[40px] w-[120px] h-7 opacity-85 shadow-[0_1px_3px_rgba(0,0,0,0.08)] -rotate-[8deg]"
          style={{ background: "#90c4d6cc" }}
        />
        <div
          className="absolute top-[50px] right-[80px] w-[120px] h-7 opacity-85 shadow-[0_1px_3px_rgba(0,0,0,0.08)] rotate-[12deg]"
          style={{ background: "#e8a57acc" }}
        />

        <div className="flex justify-between mb-6">
          <Link
            href="/"
            className="font-[family-name:var(--font-hand)] text-[var(--ink-faint)] hover:text-[var(--coral)] text-lg transition-colors no-underline"
          >
            ← 回首頁
          </Link>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-end gap-10 relative">
          <div className="relative">
            <div className="font-[family-name:var(--font-hand)] text-[28px] text-[var(--coral)] -rotate-2 inline-block mb-1">
              our family journey · no.01
            </div>
            <span
              className={`inline-block font-[family-name:var(--font-hand)] text-[18px] px-3 py-0.5 rounded-xl -rotate-2 mb-2 ml-3 align-middle ${modeBadge.cls}`}
            >
              {modeBadge.text}
            </span>
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

        <div className="mt-12 grid grid-cols-4 gap-5 pt-7 border-t border-dashed border-[var(--rule)]">
          <MetaItem label="旅行天數" value={`${days} 天 ${nights} 夜`} sub={trip.dateRangeLabel} />
          {trip.members && (
            <MetaItem label="同行成員" value={`${trip.members.length} 組`} sub={trip.members.join(" · ")} />
          )}
          {trip.hotel && <MetaItem label="住宿" value={trip.hotel.name} sub={trip.hotel.area} />}
          {trip.transport && <MetaItem label="交通" value={trip.transport.name} sub={trip.transport.note} />}
        </div>
      </div>
    </header>
  );
}

function MobileStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-[family-name:var(--font-hand)] text-xs text-[var(--ink-faint)] leading-none mb-0.5">
        {label}
      </div>
      <div className="font-serif font-bold text-[13px] text-[var(--ink)] leading-tight">
        {value}
      </div>
    </div>
  );
}

function MetaChip({ icon, label, sub }: { icon: string; label: string; sub?: string }) {
  return (
    <div className="shrink-0 bg-[var(--card-bg)] border border-[var(--rule)] rounded-xl px-3 py-2 flex items-center gap-2 min-w-[160px]">
      <span className="text-lg">{icon}</span>
      <div className="min-w-0">
        <div className="font-serif font-bold text-[13px] text-[var(--ink)] truncate">{label}</div>
        {sub && <div className="text-[11px] text-[var(--ink-faint)] truncate">{sub}</div>}
      </div>
    </div>
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
