"use client";

import { useEffect, useState } from "react";

// WMO Weather interpretation codes → emoji + 中文描述
function describeWeatherCode(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: "☀️", label: "晴天" };
  if (code === 1) return { emoji: "🌤️", label: "大致晴" };
  if (code === 2) return { emoji: "⛅", label: "多雲" };
  if (code === 3) return { emoji: "☁️", label: "陰天" };
  if (code === 45 || code === 48) return { emoji: "🌫️", label: "有霧" };
  if (code >= 51 && code <= 57) return { emoji: "🌦️", label: "毛毛雨" };
  if (code >= 61 && code <= 67) return { emoji: "🌧️", label: "有雨" };
  if (code >= 71 && code <= 77) return { emoji: "🌨️", label: "有雪" };
  if (code >= 80 && code <= 82) return { emoji: "🌦️", label: "陣雨" };
  if (code === 85 || code === 86) return { emoji: "🌨️", label: "陣雪" };
  if (code >= 95) return { emoji: "⛈️", label: "雷雨" };
  return { emoji: "🌡️", label: "—" };
}

interface WeatherData {
  emoji: string;
  label: string;
  tempMax: number;
  tempMin: number;
  precipProb: number;
}

interface Props {
  date: string; // ISO: "2026-04-29"
  lat: number;
  lng: number;
}

export function DayWeather({ date, lat, lng }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "unavailable">("loading");

  useEffect(() => {
    let cancelled = false;

    async function fetchWeather() {
      try {
        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lat}&longitude=${lng}` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
          `&timezone=Asia%2FTokyo` +
          `&start_date=${date}&end_date=${date}`;

        const res = await fetch(url, { next: { revalidate: 3600 } } as RequestInit);
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();

        const daily = json.daily;
        if (!daily || !daily.time || daily.time.length === 0) {
          if (!cancelled) setStatus("unavailable");
          return;
        }

        const { emoji, label } = describeWeatherCode(daily.weather_code[0]);
        if (!cancelled) {
          setWeather({
            emoji,
            label,
            tempMax: Math.round(daily.temperature_2m_max[0]),
            tempMin: Math.round(daily.temperature_2m_min[0]),
            precipProb: daily.precipitation_probability_max[0] ?? 0,
          });
          setStatus("ok");
        }
      } catch {
        if (!cancelled) setStatus("unavailable");
      }
    }

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [date, lat, lng]);

  if (status === "loading") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[var(--ink-faint)] animate-pulse">
        <span>🌡️</span>
        <span>天氣載入中…</span>
      </span>
    );
  }

  if (status === "unavailable" || !weather) {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs text-[var(--ink-faint)] opacity-60"
        title="天氣預報資料暫不可用（出發前 14 天才會更新）"
      >
        <span>📅</span>
        <span>天氣預報將於出發前 14 天更新</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-xs text-[var(--ink-soft)]">
      <span className="text-base leading-none">{weather.emoji}</span>
      <span>{weather.label}</span>
      <span className="font-semibold text-[var(--ink)]">
        {weather.tempMax}° / {weather.tempMin}°
      </span>
      {weather.precipProb > 0 && (
        <span className="text-[var(--ocean)] flex items-center gap-0.5">
          <span>💧</span>
          <span>{weather.precipProb}%</span>
        </span>
      )}
    </span>
  );
}
