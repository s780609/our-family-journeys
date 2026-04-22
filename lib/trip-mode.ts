import type { TripFrontmatter, TripMode } from "./types";

/**
 * Resolve a trip's mode. If `mode` is set in frontmatter, use it.
 * Otherwise infer from `endDate`: trips whose endDate is today or in the
 * future are "planning", otherwise "record".
 *
 * Lives in its own module (no Node-only imports) so it can be used from
 * client components.
 */
export function resolveTripMode(
  trip: Pick<TripFrontmatter, "mode" | "endDate">,
  now: Date = new Date()
): TripMode {
  if (trip.mode) return trip.mode;
  const end = new Date(trip.endDate);
  const endMidnight = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return endMidnight.getTime() >= today.getTime() ? "planning" : "record";
}
