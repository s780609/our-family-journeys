// Tiny helpers for mobile UX — haptics, maps, calendar
export function haptic(kind: "light" | "medium" | "heavy" = "light") {
  if (typeof navigator === "undefined") return;
  if (navigator.vibrate) {
    navigator.vibrate(kind === "heavy" ? 20 : kind === "medium" ? 12 : 8);
  }
}

export function openMaps(query: string, lat?: number, lon?: number) {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const q = encodeURIComponent(query);
  if (isIOS) {
    const ll = lat && lon ? `&ll=${lat},${lon}` : "";
    window.location.href = `https://maps.apple.com/?q=${q}${ll}`;
  } else {
    const ll = lat && lon ? `${lat},${lon}` : q;
    window.location.href = `https://www.google.com/maps/search/?api=1&query=${ll}`;
  }
}

export function addToCalendar(opts: {
  title: string;
  start: string; // ISO "2026-04-29T10:00"
  end: string;
  location?: string;
  description?: string;
}) {
  const fmt = (d: string) => d.replace(/[-:]/g, "").replace("T", "T") + "00";
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Family Journey//ZH//",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@family`,
    `SUMMARY:${opts.title}`,
    `DTSTART:${fmt(opts.start)}`,
    `DTEND:${fmt(opts.end)}`,
    opts.location ? `LOCATION:${opts.location}` : "",
    opts.description ? `DESCRIPTION:${opts.description.replace(/\n/g, "\\n")}` : "",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${opts.title}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function shareTrip(data: { title: string; text?: string; url?: string }) {
  if (typeof navigator !== "undefined" && (navigator as any).share) {
    try {
      await (navigator as any).share(data);
      return true;
    } catch {
      return false;
    }
  }
  try {
    await navigator.clipboard.writeText(data.url || location.href);
    alert("連結已複製");
    return true;
  } catch {
    return false;
  }
}
