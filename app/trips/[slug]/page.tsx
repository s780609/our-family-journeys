import { notFound } from "next/navigation";
import { getAllTripSlugs, getTrip } from "@/lib/trips";
import { TripHero } from "@/components/TripHero";
import { DaySection } from "@/components/DaySection";
import { ScrollProgress, BackTop, DayCollapseToggle } from "@/components/ScrollUI";
import { TweaksPanel } from "@/components/TweaksPanel";
import { MobileNav } from "@/components/MobileNav";

export async function generateStaticParams() {
  const slugs = await getAllTripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) return { title: "Trip not found" };
  return { title: `${trip.title} · Our Family Journeys` };
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) notFound();

  const railDays = trip.days.map((d) => ({ num: d.num, date: d.date, theme: d.theme }));
  const mobileDays = trip.days.map((d) => ({
    id: `day-${d.num}`,
    label: `Day ${d.num}`,
    date: d.date,
    title: d.theme ?? "",
  }));

  return (
    <>
      <MobileNav
        days={mobileDays}
        tripTitle={trip.title}
        location={trip.location}
        dateRangeLabel={trip.dateRangeLabel}
      />
      <TripHero trip={trip} />
      <main className="max-w-[1400px] mx-auto px-6 md:px-[72px] pb-32 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-14 relative z-[2]">
        <ScrollProgress days={railDays} />
        <section className="min-w-0">
          {trip.days.map((d) => (
            <DaySection key={d.num} day={d} />
          ))}
          <div className="mt-20 p-10 rounded-2xl text-center text-white relative overflow-hidden shadow-[var(--shadow-lift)] bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean-deep)]">
            <h3 className="font-serif font-bold text-3xl m-0 mb-2">平安的旅程 · 美好的回憶</h3>
            <p className="font-[family-name:var(--font-hand)] text-[22px] m-0 opacity-95">
              Our Family Journeys · No. 01 · {trip.locationEn || trip.location} {trip.year}
            </p>
          </div>
        </section>
      </main>
      <BackTop />
      <DayCollapseToggle />
      <TweaksPanel />
    </>
  );
}
