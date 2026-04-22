export type PhotoVariant =
  | "ocean"
  | "coral"
  | "leaf"
  | "sun"
  | "sand"
  | "sky"
  | "night"
  | "earth";

export interface Chip {
  type: "price" | "time" | "info";
  text: string;
}

export interface LinkItem {
  type: "map" | "web";
  url: string;
  text: string;
}

export interface PhotoRef {
  label: string;
  variant: PhotoVariant;
  src?: string; // future: real image path
}

export interface MealOption {
  name: string;
  note?: string;
  url?: string;
}

export interface DetourItem {
  name: string;
  meta?: string;
  addr?: string;
  note?: string;
  url?: string;
}

export type Stop =
  | { type: "move"; time: string; text: string }
  | {
      type: "spot";
      time: string;
      badge?: string;
      badgeType?: "main" | "move" | "meal";
      title: string;
      photo?: PhotoRef;
      desc?: string;
      chips?: Chip[];
      links?: LinkItem[];
      tips?: string[];
    }
  | {
      type: "meal";
      time?: string;
      label: string;
      options: MealOption[];
    }
  | {
      type: "detour";
      title: string;
      hint?: string;
      items: DetourItem[];
      tip?: string;
    }
  | { type: "note"; text: string };

export interface Day {
  num: number;
  date: string;
  dateFull: string;
  theme: string;
  sub?: string;
  stops: Stop[];
}

export type TripMode = "planning" | "record";

export interface TripFrontmatter {
  slug: string;
  title: string;
  subtitle?: string;
  year: number;
  startDate: string;
  endDate: string;
  dateRangeLabel: string;
  location: string;
  locationEn?: string;
  lat?: number; // Google Maps pin latitude
  lng?: number; // Google Maps pin longitude
  mapX?: number; // percent, for legacy hand-drawn map pin
  mapY?: number;
  coverVariant?: PhotoVariant;
  /** Optional real cover photo path (relative to /public), used for hero & OG image */
  coverPhoto?: string;
  /**
   * "planning" = 尚未出發,規劃模式;"record" = 已完成,紀錄模式。
   * Omit to auto-infer from endDate vs. today.
   */
  mode?: TripMode;
  members?: string[];
  hotel?: { name: string; area: string; nights: number };
  transport?: { name: string; note: string };
  flights?: { outbound: string; return: string };
  checklist?: ChecklistCategory[];
  budget?: Budget;
  days: Day[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  note?: string;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
}

export interface BudgetItem {
  label: string;
  amount: string;
  note?: string;
}

export interface Budget {
  title?: string;
  note?: string;
  items: BudgetItem[];
  total?: BudgetItem;
}

export interface Trip extends TripFrontmatter {
  bodyHtml: string;
}
