"use client";

import { useState } from "react";

/**
 * Small "分享此日" button. Copies the current page URL with `#day-N` anchor
 * to the clipboard, or falls back to the Web Share API when available.
 */
export function DayShareButton({
  dayNum,
  dayTitle,
}: {
  dayNum: number;
  dayTitle: string;
}) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    url.hash = `day-${dayNum}`;
    const shareUrl = url.toString();
    const shareText = `Day ${dayNum} · ${dayTitle}`;

    // Prefer native share on mobile if available
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title: shareText, url: shareUrl });
        return;
      } catch {
        // user cancelled or unsupported — fall through to clipboard
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for browsers/contexts where the Clipboard API is unavailable
        // (e.g. non-secure contexts). execCommand is deprecated but widely
        // supported; we keep it as a best-effort last resort.
        const ta = document.createElement("textarea");
        ta.value = shareUrl;
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setState("copied");
      setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 1800);
    }
  }

  const label =
    state === "copied" ? "已複製 ✓" : state === "error" ? "複製失敗" : "分享";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`分享 Day ${dayNum} 連結`}
      title={`複製 Day ${dayNum} 的分享連結`}
      className="day-share shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 font-[family-name:var(--font-hand)] text-sm md:text-base text-[var(--ocean)] border border-[var(--ocean)]/40 rounded-full bg-[var(--card-bg)] transition-all hover:bg-[var(--ocean)] hover:text-white hover:-translate-y-[1px]"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
