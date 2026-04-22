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
  members?: string[];
  hotel?: { name: string; area: string; nights: number };
  transport?: { name: string; note: string };
  flights?: { outbound: string; return: string };
  checklist?: { id: string; title: string; icon: string; items: { id: string; label: string; note?: string }[] }[];
  days: Day[];
}

export interface Trip extends TripFrontmatter {
  bodyHtml: string;
}
