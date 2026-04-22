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

**可選欄位**:
- `mode`:`planning`(規劃中)或 `record`(紀錄)。省略時會依 `endDate` 自動判斷,今天之後是規劃中,之前是紀錄
- `coverPhoto`:封面照片路徑(`/images/...`),用於 Open Graph 圖片與首頁卡片
- `coverVariant`:沒放真實照片時用的色塊配色(`ocean` / `coral` / `leaf` / `sun` / `sand` / `sky` / `night` / `earth`)

**地圖圖釘位置**:用 `mapX` 與 `mapY`(以百分比 0-100 表示在 SVG 地圖上的位置)

**景點類型**(`days[].stops[].type`):
- `move` — 移動/交通,簡單一行
- `spot` — 主要景點卡,有照片色塊、徽章、描述、chips、Google Maps / 官網連結、家庭小提醒
- `meal` — 餐廳三選一
- `detour` — 可收合的推薦停靠點(對應原 MD 的 `<details>`)
- `note` — 手寫筆記便條

**真實照片**:把檔案放進 `public/images/trips/<slug>/`,再在 `stops[].photo.src` 填 `/images/trips/<slug>/<檔名>`。本地路徑會走 Next.js 圖片最佳化;若是外部 URL 則自動使用 `unoptimized`。沒設 `src` 時繼續用 `variant` 色塊作佔位圖。

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
- 相片:放進 `public/images/trips/<slug>/`,再把 `photo.src` 指過去;沒圖時會自動 fallback 成 `variant` 色塊
- 分享:每個 Day 標題右側都有「分享」按鈕,會把 `#day-N` 連結加到目前網址並複製到剪貼簿(行動裝置優先用 Web Share API)
- OG 圖:首頁與每趟旅程會自動生成 `opengraph-image`(`app/opengraph-image.tsx` 與 `app/trips/[slug]/opengraph-image.tsx`)。若要正確解析絕對網址,部署時可設 `NEXT_PUBLIC_SITE_URL`

## 待辦

- [x] 支援真實照片(檔案放 `public/images/trips/<slug>/`;色塊作為 fallback)
- [x] 行程規劃模式(vs. 紀錄模式) — frontmatter `mode` 或依 `endDate` 自動判斷
- [x] OG image 自動生成
- [x] 每個 Day 獨立分享連結
