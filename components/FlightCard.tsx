import type { FlightSegment } from "@/lib/types";

export function FlightCard({
  flight,
  direction,
}: {
  flight: FlightSegment;
  direction: "outbound" | "return";
}) {
  const badgeText = direction === "outbound" ? "去程航班" : "回程航班";
  const badgeIcon = direction === "outbound" ? "✈" : "🛬";
  const dateLabel = formatDate(flight.date, flight.weekday);

  return (
    <div className="relative mb-8 md:mb-10">
      {/* washi tapes */}
      <div
        className="absolute -top-2 left-8 w-20 h-5 md:w-24 md:h-6 opacity-85 shadow-sm -rotate-[6deg] z-10"
        style={{ background: "#90c4d6cc" }}
        aria-hidden
      />
      <div
        className="absolute -top-1 right-10 w-16 h-5 md:w-20 md:h-6 opacity-85 shadow-sm rotate-[8deg] z-10"
        style={{ background: "var(--tape)" }}
        aria-hidden
      />

      <article
        className="relative rounded-2xl border-[1.5px] border-[var(--ink)] bg-[var(--card-bg)] shadow-[var(--shadow-soft)] overflow-hidden"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 18px, rgba(45,36,25,0.035) 18px 19px)",
        }}
      >
        <div className="px-5 md:px-8 pt-6 pb-5 md:pb-6">
          {/* Top row: badge + meta */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 md:mb-5">
            <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-hand)] text-[15px] md:text-[17px] px-3 py-0.5 rounded-xl -rotate-2 bg-[var(--ocean)] text-white shadow-sm">
              <span>{badgeIcon}</span>
              {badgeText}
            </span>
            <div className="font-[family-name:var(--font-hand)] text-[15px] md:text-[17px] text-[var(--ink-soft)]">
              {dateLabel}
            </div>
          </div>

          {/* Main row: FROM — arc — TO */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
            <Endpoint endpoint={flight.from} align="left" />
            <FlightArc duration={flight.duration} />
            <Endpoint endpoint={flight.to} align="right" />
          </div>

          {/* Footer meta */}
          <div className="mt-5 pt-4 border-t border-dashed border-[var(--rule)] flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-[13px] md:text-sm text-[var(--ink-soft)]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <MetaField label="航空公司" value={flight.airline} />
              <MetaField label="航班" value={flight.code} mono />
              {flight.pnr && <MetaField label="訂位編號" value={flight.pnr} mono />}
            </div>
            {flight.manageUrl && (
              <a
                href={flight.manageUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[13px] font-medium text-white bg-[var(--ocean)] rounded-full transition-all hover:bg-[var(--ocean-deep)] hover:-translate-y-[1px] no-underline"
              >
                管理預訂 →
              </a>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

function Endpoint({
  endpoint,
  align,
}: {
  endpoint: { iata: string; city: string; terminal?: string; time: string };
  align: "left" | "right";
}) {
  const alignClass = align === "left" ? "text-left" : "text-right";
  return (
    <div className={`min-w-0 ${alignClass}`}>
      <div className="font-serif font-black text-[40px] md:text-[56px] leading-none tracking-wider text-[var(--ink)]">
        {endpoint.iata}
      </div>
      <div className="font-[family-name:var(--font-hand)] text-[22px] md:text-[28px] text-[var(--coral)] leading-tight mt-1 md:mt-2">
        {endpoint.time}
      </div>
      <div className="text-[12px] md:text-[13px] text-[var(--ink-faint)] mt-0.5 truncate">
        {endpoint.city}
        {endpoint.terminal ? ` · ${endpoint.terminal}` : ""}
      </div>
    </div>
  );
}

function FlightArc({ duration }: { duration?: string }) {
  return (
    <div className="flex flex-col items-center shrink-0 w-[88px] md:w-[200px]">
      <svg
        viewBox="0 0 200 60"
        className="w-full h-10 md:h-14"
        aria-hidden
      >
        <path
          d="M 8 52 Q 100 -10 192 52"
          fill="none"
          stroke="var(--ocean)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="4 4"
          opacity={0.7}
        />
        <g transform="translate(100 16)">
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={22}
            fill="var(--ocean)"
          >
            ✈
          </text>
        </g>
      </svg>
      {duration && (
        <div className="font-[family-name:var(--font-hand)] text-[14px] md:text-[16px] text-[var(--ink-soft)] -mt-1 md:mt-0.5">
          {duration}
        </div>
      )}
    </div>
  );
}

function MetaField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[11px] md:text-xs text-[var(--ink-faint)] tracking-wider uppercase">
        {label}
      </span>
      <span
        className={`font-serif font-bold text-[var(--ink)] ${
          mono ? "font-mono tracking-wide" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function formatDate(date: string, weekday?: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return weekday ? `${date} (${weekday})` : date;
  }
  const m = parsed.getMonth() + 1;
  const d = parsed.getDate();
  const base = `${parsed.getFullYear()} 年 ${m} 月 ${d} 日`;
  return weekday ? `${base} · 星期${weekday}` : base;
}
