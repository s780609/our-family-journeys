import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import type { Trip, TripFrontmatter } from "./types";

const TRIPS_DIR = path.join(process.cwd(), "content", "trips");

export async function getAllTripSlugs(): Promise<string[]> {
  if (!fs.existsSync(TRIPS_DIR)) return [];
  return fs
    .readdirSync(TRIPS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export async function getTrip(slug: string): Promise<Trip | null> {
  const filePath = path.join(TRIPS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(html).process(content);
  const bodyHtml = processed.toString();
  const fm = data as TripFrontmatter;
  return { ...fm, bodyHtml };
}

export async function getAllTrips(): Promise<Trip[]> {
  const slugs = await getAllTripSlugs();
  const trips = await Promise.all(slugs.map((s) => getTrip(s)));
  return trips
    .filter((t): t is Trip => t !== null)
    .sort((a, b) => b.year - a.year || b.startDate.localeCompare(a.startDate));
}

export async function getTripsByYear(): Promise<Map<number, Trip[]>> {
  const trips = await getAllTrips();
  const map = new Map<number, Trip[]>();
  for (const t of trips) {
    if (!map.has(t.year)) map.set(t.year, []);
    map.get(t.year)!.push(t);
  }
  return map;
}
