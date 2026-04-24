import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { getAllTripSlugs, getDefaultChecklist, getTrip } from "@/lib/trips";
import { TripHero } from "@/components/TripHero";
import { DaySection } from "@/components/DaySection";
import { ScrollProgress, BackTop, DayCollapseToggle } from "@/components/ScrollUI";
import { TweaksPanel } from "@/components/TweaksPanel";
import { MobileNav } from "@/components/MobileNav";
import { Checklist } from "@/components/Checklist";
import { TripBudget } from "@/components/TripBudget";

export async function generateStaticParams() {
  const slugs = await getAllTripSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) return { title: "Trip not found" };
  const title = `${trip.title} · Our Family Journeys`;
  const description =
    trip.subtitle
      ? `${trip.subtitle} · ${trip.dateRangeLabel} · ${trip.location}`
      : `${trip.dateRangeLabel} · ${trip.location} · 家族旅行手帳`;
  const tripOg = `/og-${slug}.png`;
  const hasTripOg = fs.existsSync(path.join(process.cwd(), "public", `og-${slug}.png`));
  const ogImage = hasTripOg ? tripOg : "/og-image.png";
  return {
    title,
    description,
    openGraph: { title, description, type: "article", images: [ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) notFound();
  const checklistDefaults = await getDefaultChecklist();

  const railDays = trip.days.map((d) => ({ num: d.num, date: d.date, theme: d.theme }));
  const mobileDays = trip.days.map((d) => ({
    id: `day-${d.num}`,
    label: `Day ${d.num}`,
    date: d.date,
    title: d.theme ?? "",
  }));

  return (
    <>
      <MobileNav days={mobileDays} tripTitle={trip.title} hasChecklist />
      <TripHero trip={trip} />
      <main className="max-w-[1400px] mx-auto px-6 md:px-[72px] pb-32 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-14 relative z-[2]">
        <ScrollProgress days={railDays} />
        <section className="min-w-0">
          <Checklist
            defaults={checklistDefaults}
            extra={trip.checklist}
            storageKey={`pretrip-checklist:${trip.slug}`}
          />
          {trip.days.map((d) => (
            <DaySection key={d.num} day={d} />
          ))}
          {trip.budget && <TripBudget budget={trip.budget} />}
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
