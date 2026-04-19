import Link from "next/link";
import { getTripsByYear } from "@/lib/trips";
import { HomeMap } from "@/components/HomeMap";
import { YearList } from "@/components/YearList";

export default async function HomePage() {
  const byYear = await getTripsByYear();
  const years = Array.from(byYear.keys()).sort((a, b) => b - a);
  const allTrips = years.flatMap((y) => byYear.get(y)!);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-16 pt-16 md:pt-24 pb-10 relative z-[2]">
        <div className="font-[family-name:var(--font-hand)] text-[28px] text-[var(--coral)] -rotate-2 inline-block mb-2">
          our family journeys · 家族的旅行手帳
        </div>
        <h1 className="font-serif font-black text-[clamp(48px,7vw,110px)] leading-[0.9] tracking-tight m-0 text-[var(--ink)]">
          我們<span className="relative inline-block text-[var(--ocean)]">
            <span className="relative z-[1]">去過</span>
            <span
              className="absolute left-[-4%] right-[-4%] bottom-[10px] h-4 bg-[var(--sun)] opacity-55 rounded-full -skew-x-[4deg] -rotate-1"
              aria-hidden
            />
          </span>的地方
        </h1>
        <p className="font-[family-name:var(--font-hand)] text-[28px] text-[var(--ink-soft)] mt-4 max-w-2xl">
          記錄每一次全家出遊,也是下一次的起點。
        </p>
      </section>

      {/* Map + Year list */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-16 pb-32 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 relative z-[2]">
        <HomeMap trips={allTrips} />
        <YearList byYear={Object.fromEntries(years.map((y) => [y, byYear.get(y)!]))} years={years} />
      </section>
    </main>
  );
}
