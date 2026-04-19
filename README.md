# Our Family Journeys

家族旅遊手帳 — 記錄每一次的家庭旅行,也用來規劃下一次。

Next.js 15 + App Router + TypeScript + Tailwind CSS · Markdown 驅動的內容。

## 開發

```bash
npm install
npm run dev
# → http://localhost:3000
```

## 新增一趟旅程

在 `content/trips/` 底下建立 `<slug>.md`,frontmatter 結構參考既有的 `okinawa-2026.md`。

**必要欄位**:`slug`、`title`、`year`、`startDate`、`endDate`、`dateRangeLabel`、`location`、`days`

**地圖圖釘位置**:用 `mapX` 與 `mapY`(以百分比 0-100 表示在 SVG 地圖上的位置)

**景點類型**(`days[].stops[].type`):
- `move` — 移動/交通,簡單一行
- `spot` — 主要景點卡,有照片色塊、徽章、描述、chips、Google Maps / 官網連結、家庭小提醒
- `meal` — 餐廳三選一
- `detour` — 可收合的推薦停靠點(對應原 MD 的 `<details>`)
- `note` — 手寫筆記便條

## 部署到 Vercel

1. Push 到 GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/s780609/our-family-journeys.git
   git push -u origin main
   ```
2. 到 [vercel.com](https://vercel.com/new) import 這個 repo,一路按 Deploy 即可。Next.js 會被自動偵測。

## 結構

```
app/
  layout.tsx           根 layout + Google Fonts
  page.tsx             首頁 (手繪地圖 + 年份清單)
  globals.css          全域變數 + 色票 + 紙張紋理
  trips/[slug]/page.tsx 行程頁(SSG)
components/
  TripHero.tsx         行程頁 hero(標題 + 圓章 + 資訊條)
  DaySection.tsx       Day 區塊(標題 + 時間軸)
  StopBlock.tsx        各類型景點卡片(spot/meal/move/detour/note)
  ScrollProgress.tsx   左側時間軸 + 頂部 / 側邊進度條
  HomeMap.tsx          首頁手繪地圖 + 圖釘
  YearList.tsx         年份清單(點擊展開)
  TweaksPanel.tsx      右下角 Tweaks 面板(色調、字型、密度、日夜)
lib/
  types.ts             Trip / Day / Stop 型別
  trips.ts             讀取 markdown + gray-matter + remark
content/
  trips/*.md           每一趟旅程的資料
```

## 風格筆記

- 視覺:溫暖手作旅遊手帳 — 米白紙張底、紙張紋理、膠帶、圓章戳印
- 字型:Noto Serif TC(中文標題)+ Caveat(英文手寫)
- 主色:沖繩海藍 `#2e6b8a`,珊瑚橘點綴;可在 Tweaks 切換
- 相片:目前用色塊佔位,之後放進 `public/images/trips/<slug>/` 再把資料 `photo.src` 指過去

## 待辦

- [ ] 支援真實照片(目前是色塊佔位)
- [ ] 行程規劃模式(vs. 紀錄模式)
- [ ] OG image 自動生成
- [ ] 每個 Day 獨立分享連結
