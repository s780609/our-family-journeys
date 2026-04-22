"use client";
import { useEffect, useState } from "react";

export type ChecklistItem = { id: string; label: string; note?: string };
export type ChecklistCategory = { id: string; title: string; icon: string; items: ChecklistItem[] };

const DEFAULT_CATEGORIES: ChecklistCategory[] = [
  {
    id: "docs",
    title: "文件證件",
    icon: "📄",
    items: [
      { id: "passport", label: "護照(效期 6 個月以上)" },
      { id: "visa", label: "簽證 / 免簽確認" },
      { id: "license", label: "駕照 + 日文譯本" },
      { id: "booking", label: "訂房 / 租車 / 機票確認單" },
    ],
  },
  {
    id: "money",
    title: "金融",
    icon: "💴",
    items: [
      { id: "cash", label: "現金換匯(日圓)" },
      { id: "card", label: "信用卡 × 2 張(主 + 備)" },
      { id: "insurance", label: "旅平險 + 駕照車險" },
    ],
  },
  {
    id: "tech",
    title: "連線 / 工具",
    icon: "📱",
    items: [
      { id: "sim", label: "SIM 卡 / eSIM / 網路分享器" },
      { id: "maps", label: "離線地圖下載(Google Maps)" },
      { id: "charger", label: "充電器 + 行動電源 + 轉接頭" },
      { id: "powerbank", label: "行動電源上機檢查" },
    ],
  },
  {
    id: "kids",
    title: "小孩用品",
    icon: "🧸",
    items: [
      { id: "diapers", label: "尿布 · 濕紙巾 · 尿布袋" },
      { id: "milk", label: "奶粉 · 奶瓶 · 保溫瓶" },
      { id: "clothes-kids", label: "換洗衣物 × 天數 + 備用" },
      { id: "stroller", label: "推車 / 背帶" },
      { id: "toys", label: "安撫玩具 / 小零食" },
    ],
  },
  {
    id: "health",
    title: "藥品 / 健康",
    icon: "💊",
    items: [
      { id: "med-cold", label: "感冒藥 · 退燒藥 · 止痛藥" },
      { id: "med-stomach", label: "腸胃藥 · OK 繃 · 蚊蟲液" },
      { id: "med-elder", label: "長輩慢性處方藥(備份)" },
      { id: "sunscreen", label: "防曬 · 小孩專用" },
    ],
  },
  {
    id: "clothes",
    title: "衣物 / 隨身",
    icon: "🧳",
    items: [
      { id: "clothes", label: "衣物 × 天數" },
      { id: "rain", label: "雨衣 / 折傘" },
      { id: "camera", label: "相機 / 記憶卡" },
      { id: "hat", label: "防曬帽 · 太陽眼鏡" },
    ],
  },
];

export function Checklist({ extra }: { extra?: ChecklistCategory[] }) {
  const categories = [...DEFAULT_CATEGORIES, ...(extra ?? [])];
  const allIds = categories.flatMap((c) => c.items.map((i) => `${c.id}:${i.id}`));
  const totalCount = allIds.length;

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pretrip-checklist");
      if (saved) setChecked(new Set(JSON.parse(saved)));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("pretrip-checklist", JSON.stringify([...checked]));
  }, [checked]);

  const toggle = (key: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const doneCount = allIds.filter((id) => checked.has(id)).length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <section id="pre-trip-checklist" className="my-8 md:my-12 scroll-mt-[130px] md:scroll-mt-10">
      <div className="bg-[var(--card-bg)] border border-[var(--rule)] rounded-2xl shadow-[var(--shadow-soft)] overflow-hidden">
        {/* Header — clickable to toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center gap-4 p-4 md:p-5 text-left"
        >
          <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--sun)] flex items-center justify-center text-2xl md:text-3xl rotate-[-3deg] shadow-sm">
            ✈️
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-[family-name:var(--font-hand)] text-sm md:text-base text-[var(--coral)] -rotate-1 inline-block leading-none">
              pre-trip checklist
            </div>
            <div className="font-serif font-black text-lg md:text-2xl text-[var(--ink)] leading-tight mt-0.5">
              行前確認清單
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 max-w-[200px] h-1.5 bg-[var(--paper-dark)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--leaf)] to-[var(--ocean)] transition-[width] duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-serif font-bold text-xs md:text-sm text-[var(--ink-soft)] shrink-0">
                {doneCount}/{totalCount} · {pct}%
              </span>
            </div>
          </div>
          <span
            className={`shrink-0 w-9 h-9 rounded-full border border-[var(--rule)] bg-[var(--paper)] flex items-center justify-center text-[var(--ink-faint)] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {/* Body */}
        {open && (
          <div className="border-t border-dashed border-[var(--rule)] p-4 md:p-5 flex flex-col gap-3">
            {categories.map((cat) => {
              const catKeys = cat.items.map((i) => `${cat.id}:${i.id}`);
              const catDone = catKeys.filter((k) => checked.has(k)).length;
              const catTotal = catKeys.length;
              const catOpen = openCat === cat.id;
              return (
                <div
                  key={cat.id}
                  className="border border-[var(--rule)] rounded-xl bg-[var(--paper)]/50 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenCat(catOpen ? null : cat.id)}
                    className="w-full flex items-center gap-3 p-3 md:p-3.5 text-left min-h-[56px]"
                  >
                    <span className="text-xl md:text-2xl shrink-0">{cat.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-bold text-[15px] md:text-base text-[var(--ink)] leading-tight">
                        {cat.title}
                      </div>
                      <div className="text-xs text-[var(--ink-faint)] mt-0.5">
                        {catDone}/{catTotal} 完成
                      </div>
                    </div>
                    {catDone === catTotal && catTotal > 0 && (
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--leaf)] text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                    )}
                    <span
                      className={`shrink-0 text-[var(--ink-faint)] transition-transform ${
                        catOpen ? "rotate-90" : ""
                      }`}
                    >
                      ▸
                    </span>
                  </button>
                  {catOpen && (
                    <div className="border-t border-dashed border-[var(--rule)] p-2 md:p-3 flex flex-col gap-1">
                      {cat.items.map((it) => {
                        const key = `${cat.id}:${it.id}`;
                        const on = checked.has(key);
                        return (
                          <label
                            key={it.id}
                            className={`flex items-start gap-3 p-2.5 md:p-3 rounded-lg cursor-pointer transition min-h-[48px] ${
                              on ? "bg-[var(--leaf)]/10" : "hover:bg-[var(--paper-dark)]/40"
                            }`}
                          >
                            <span
                              className={`shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                                on
                                  ? "bg-[var(--leaf)] border-[var(--leaf)] text-white"
                                  : "border-[var(--rule)] bg-[var(--card-bg)]"
                              }`}
                            >
                              {on && (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3">
                                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </span>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={on}
                              onChange={() => toggle(key)}
                            />
                            <span
                              className={`flex-1 text-sm md:text-[15px] leading-snug ${
                                on ? "line-through text-[var(--ink-faint)]" : "text-[var(--ink)]"
                              }`}
                            >
                              {it.label}
                              {it.note && (
                                <span className="block text-xs text-[var(--ink-faint)] mt-0.5">
                                  {it.note}
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Reset */}
            <button
              onClick={() => {
                if (confirm("清空所有打勾?")) setChecked(new Set());
              }}
              className="mt-2 self-center text-sm text-[var(--ink-faint)] underline hover:text-[var(--coral)]"
            >
              清空全部
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
