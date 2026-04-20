import Image from "next/image";
import type { Stop, MealOption, DetourItem, Chip, LinkItem } from "@/lib/types";

const MapIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
    <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" />
    <circle cx={12} cy={9} r={2.5} />
  </svg>
);
const WebIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
    <circle cx={12} cy={12} r={9} />
    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
  </svg>
);

function Chips({ items }: { items?: Chip[] }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-wrap gap-y-1.5 gap-x-2 my-2.5 text-[13px] text-[var(--ink-soft)]">
      {items.map((c, i) => (
        <span
          key={i}
          className={`inline-flex items-center gap-1 px-2.5 py-[3px] rounded-[14px] ${
            c.type === "price"
              ? "bg-[#fce8b588] text-[#7a5a1a] dark:bg-[#4a3d1a] dark:text-[#f0c878]"
              : "bg-[var(--paper-dark)]"
          }`}
        >
          {c.text}
        </span>
      ))}
    </div>
  );
}

function Links({ items }: { items?: LinkItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="flex gap-2 flex-wrap mt-3">
      {items.map((l, i) =>
        l.type === "map" ? (
          <a
            key={i}
            href={l.url}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-white bg-[var(--ocean)] rounded-full transition-all hover:bg-[var(--ocean-deep)] hover:-translate-y-[1px] no-underline min-h-[40px] md:min-h-0"
          >
            <MapIcon />
            {l.text}
          </a>
        ) : (
          <a
            key={i}
            href={l.url}
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-[var(--ocean)] border border-[var(--ocean)] rounded-full transition-all hover:bg-[var(--ocean)] hover:text-white hover:-translate-y-[1px] no-underline min-h-[40px] md:min-h-0"
          >
            <WebIcon />
            {l.text}
          </a>
        )
      )}
    </div>
  );
}

function FamilyTips({ tips }: { tips?: string[] }) {
  if (!tips?.length) return null;
  return (
    <div className="mt-3.5 px-3.5 py-3 bg-[rgba(232,176,74,0.12)] border-l-[3px] border-[var(--sun)] rounded-[4px] text-[13px] text-[var(--ink-soft)] leading-relaxed">
      <span className="font-[family-name:var(--font-hand)] text-base text-[var(--sun)] dark:text-[#f0c878] font-bold mr-1.5">
        家庭小提醒
      </span>
      <ul className="ml-[18px] mt-1 list-disc">
        {tips.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function Badge({ badge, type }: { badge: string; type?: "main" | "move" | "meal" }) {
  const style =
    type === "main"
      ? "bg-[var(--ocean)] text-white"
      : type === "meal"
      ? "bg-[var(--coral-soft)] text-white"
      : type === "move"
      ? "bg-[var(--paper-dark)] text-[var(--ink-soft)]"
      : "bg-[var(--sun)] text-[var(--ink)]";
  return (
    <span
      className={`inline-block font-[family-name:var(--font-hand)] text-sm px-2.5 py-0.5 rounded-xl mb-1.5 -rotate-1 ${style}`}
    >
      {badge}
    </span>
  );
}

export function StopBlock({ stop }: { stop: Stop }) {
  return (
    <div className="relative">
      {/* Desktop rail dot */}
      <div className="hidden md:block">
        <StopDot highlight={stop.type === "spot" && stop.badgeType === "main"} />
      </div>
      {renderStop(stop)}
    </div>
  );
}

function StopDot({ highlight }: { highlight?: boolean }) {
  return (
    <span
      className={`absolute left-[-44px] top-3 w-3.5 h-3.5 rounded-full z-10 ${
        highlight
          ? "bg-[var(--coral)] border-2 border-[var(--coral)] shadow-[0_0_0_5px_rgba(217,104,80,0.15)]"
          : "bg-[var(--paper)] border-2 border-[var(--ocean)]"
      }`}
    />
  );
}

function StopTime({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-[family-name:var(--font-hand)] text-[20px] md:text-[22px] text-[var(--coral)] font-semibold mb-1.5 tracking-wide">
      {children}
    </div>
  );
}

function renderStop(stop: Stop) {
  if (stop.type === "move") {
    return (
      <>
        <StopTime>{stop.time}</StopTime>
        <div className="flex items-center gap-3 px-4 py-3 border border-dashed border-[var(--rule)] rounded-xl text-sm text-[var(--ink-soft)] bg-[var(--paper-dark)]/40">
          <span className="font-[family-name:var(--font-hand)] text-[22px] text-[var(--ocean)]">→</span>
          <span>{stop.text}</span>
        </div>
      </>
    );
  }

  if (stop.type === "note") {
    return (
      <>
        <StopTime>&nbsp;</StopTime>
        <div
          className="bg-[#fdf5d8] dark:bg-[#3a2e15] border border-[#e8c870] dark:border-[#6a5a30] text-[#7a5a1a] dark:text-[#f0d878] font-[family-name:var(--font-hand)] text-lg px-5 py-4 rounded-xl leading-relaxed -rotate-[0.3deg] shadow-[var(--shadow-soft)]"
          dangerouslySetInnerHTML={{ __html: stop.text }}
        />
      </>
    );
  }

  if (stop.type === "meal") {
    return <MealBlock time={stop.time} label={stop.label} options={stop.options} />;
  }

  if (stop.type === "detour") {
    return (
      <>
        <StopTime>&nbsp;</StopTime>
        <DetourBlock {...stop} />
      </>
    );
  }

  // spot — mobile: photo-on-top full-bleed card; desktop: 200px side-by-side
  const s = stop;
  return (
    <>
      <StopTime>{s.time}</StopTime>
      <article
        className="bg-[var(--card-bg)] rounded-2xl md:rounded-lg shadow-[var(--shadow-soft)] border border-[rgba(201,184,144,0.35)] overflow-hidden md:overflow-visible transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[var(--shadow-lift)]"
      >
        {/* Photo — mobile: top full-bleed 16:10; desktop: left 200px */}
        <div className="md:hidden">
          <Photo s={s} mobile />
        </div>

        <div className="md:grid md:grid-cols-[200px_1fr] md:gap-5" style={{ padding: "var(--density-pad)" }}>
          <div className="hidden md:block">
            <Photo s={s} />
          </div>
          <div className="min-w-0 pt-4 md:pt-0 px-1 md:px-0">
            {s.badge && <Badge badge={s.badge} type={s.badgeType} />}
            <h4 className="font-serif font-bold text-xl md:text-[22px] text-[var(--ink)] leading-snug mb-2 mt-1">
              {s.title}
            </h4>
            {s.desc && (
              <div
                className="text-[15px] text-[var(--ink-soft)] leading-relaxed mb-3 spot-desc"
                dangerouslySetInnerHTML={{ __html: s.desc }}
              />
            )}
            <Chips items={s.chips} />
            <Links items={s.links} />
            <FamilyTips tips={s.tips} />
          </div>
        </div>
      </article>
    </>
  );
}

function Photo({ s, mobile = false }: { s: any; mobile?: boolean }) {
  const src = s.photo?.src ? encodeURI(s.photo.src) : undefined;
  const aspectClass = mobile ? "aspect-[16/10] rounded-none" : "aspect-[4/3] rounded-md";

  if (src) {
    return (
      <div className={`relative overflow-hidden ${aspectClass} bg-[var(--paper-dark)]`}>
        <Image
          src={src}
          alt={s.photo?.label ?? s.title}
          fill
          sizes={mobile ? "100vw" : "200px"}
          className="object-cover"
          unoptimized
        />
      </div>
    );
  }
  return (
    <div
      className={`photo-${s.photo?.variant ?? "ocean"} photo-grain relative overflow-hidden flex items-center justify-center text-center p-4 font-serif font-bold text-white leading-snug [text-shadow:0_1px_3px_rgba(0,0,0,0.3)] ${
        mobile ? `${aspectClass} text-[22px]` : `${aspectClass} text-[18px]`
      }`}
    >
      <span className="absolute top-2 right-2 font-[family-name:var(--font-hand)] text-sm px-2 py-0.5 bg-white/90 text-[var(--ink)] rounded-xl [text-shadow:none] z-[1]">
        📷 佔位
      </span>
      <span className="relative z-[1]">{s.photo?.label ?? s.title}</span>
    </div>
  );
}

function MealBlock({ time, label, options }: { time?: string; label: string; options: MealOption[] }) {
  return (
    <>
      <StopTime>{time ?? "\u00A0"}</StopTime>
      <div className="bg-[var(--card-bg)] rounded-2xl md:rounded-lg p-4 md:p-5 shadow-[var(--shadow-soft)] border border-dashed border-[var(--coral)]">
        <div className="font-[family-name:var(--font-hand)] text-[20px] text-[var(--coral)] font-semibold mb-2.5">
          🍽 {label}
        </div>
        <MealOptions options={options} />
      </div>
    </>
  );
}

function MealOptions({ options }: { options: MealOption[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 md:gap-3">
      {options.map((o, i) => (
        <MealOption key={i} option={o} />
      ))}
    </div>
  );
}

function MealOption({ option }: { option: MealOption }) {
  return (
    <div className="meal-option relative p-3.5 bg-[var(--paper)] border border-[var(--rule)] rounded-xl md:rounded-md cursor-pointer transition-all hover:border-[var(--coral)] hover:-translate-y-0.5 min-h-[60px] md:min-h-0">
      <div className="font-serif font-bold text-[15px] text-[var(--ink)] mb-0.5">{option.name}</div>
      {option.note && <div className="text-xs text-[var(--ink-faint)] leading-snug">{option.note}</div>}
      {option.url && (
        <a
          href={option.url}
          target="_blank"
          rel="noopener"
          className="inline-block mt-1.5 text-xs text-[var(--ocean)] no-underline hover:underline"
        >
          Google Maps ↗
        </a>
      )}
    </div>
  );
}

function DetourBlock({ title, hint, items, tip }: { title: string; hint?: string; items: DetourItem[]; tip?: string }) {
  return (
    <details className="detour bg-[var(--paper-dark)] rounded-2xl md:rounded-lg overflow-hidden border border-dashed border-[var(--ink-faint)] group">
      <summary className="px-4 md:px-4.5 py-3.5 cursor-pointer flex items-center gap-2.5 select-none font-serif font-medium text-[var(--ink)] hover:bg-black/[0.04] list-none [&::-webkit-details-marker]:hidden min-h-[52px]">
        <span className="detour-caret text-[var(--ink-faint)] group-open:rotate-90 transition-transform">▸</span>
        <span className="font-[family-name:var(--font-hand)] text-[var(--coral)] text-[20px] mr-1">✎</span>
        <span className="flex-1">
          {title}
          {hint && <em className="text-[var(--ink-faint)] not-italic"> · {hint}</em>}
        </span>
      </summary>
      <div className="px-4 md:px-5 pb-5 pt-4 border-t border-dashed border-[var(--rule)] flex flex-col gap-3">
        {items.map((it, i) => (
          <div key={i} className="p-3.5 bg-[var(--card-bg)] rounded-xl md:rounded-md border-l-[3px] border-[var(--leaf)]">
            <div className="font-serif font-bold text-[15px] text-[var(--ink)] mb-1">{it.name}</div>
            {it.meta && <div className="text-[13px] text-[var(--ink-soft)] mb-1">{it.meta}</div>}
            {it.addr && (
              <div className="text-xs text-[var(--ink-faint)] mb-1 font-[family-name:Shippori_Mincho,var(--font-serif)]">
                {it.addr}
              </div>
            )}
            {it.note && <div className="text-[13px] text-[var(--ink-soft)]">{it.note}</div>}
            {it.url && (
              <a
                href={it.url}
                target="_blank"
                rel="noopener"
                className="inline-block mt-1.5 text-xs text-[var(--ocean)] no-underline hover:underline"
              >
                Google Maps ↗
              </a>
            )}
          </div>
        ))}
        {tip && (
          <div className="text-[13px] text-[var(--ink-soft)] mt-2 px-3 py-2 bg-[rgba(107,142,78,0.1)] rounded-md leading-relaxed">
            💡 {tip}
          </div>
        )}
      </div>
    </details>
  );
}
