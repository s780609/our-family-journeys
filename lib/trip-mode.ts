import type { TripFrontmatter, TripMode } from "./types";

/**
 * Resolve a trip's mode. If `mode` is set in frontmatter, use it.
 * Otherwise infer from `startDate`/`endDate`:
 *   - today < startDate → "planning"
 *   - startDate ≤ today ≤ endDate → "ongoing"
 *   - today > endDate → "record"
 *
 * Lives in its own module (no Node-only imports) so it can be used from
 * client components.
 */
export function resolveTripMode(
  trip: Pick<TripFrontmatter, "mode" | "startDate" | "endDate">,
  now: Date = new Date()
): TripMode {
  if (trip.mode) return trip.mode;
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  if (today < startMidnight) return "planning";
  if (today <= endMidnight) return "ongoing";
  return "record";
}
