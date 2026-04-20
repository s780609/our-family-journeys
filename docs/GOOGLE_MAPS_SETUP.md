# Google Maps API Key — 申請步驟

## 1. 建立 Google Cloud 專案
1. 到 https://console.cloud.google.com/
2. 右上角建立新專案,取名例如 `our-family-journeys`

## 2. 啟用 Maps JavaScript API
1. 左側選單 → **APIs & Services → Library**
2. 搜尋 **Maps JavaScript API** → 點 **Enable**
3. (可選)同時啟用 **Places API**、**Geocoding API** 以備未來使用

## 3. 建立 API Key
1. 左側選單 → **APIs & Services → Credentials**
2. 點 **+ CREATE CREDENTIALS → API key**
3. Key 產生後,**立刻點「RESTRICT KEY」** — 不限制的 key 會被盜刷

## 4. 限制 Key(重要!不然會被盜刷帳單爆炸)

### Application restrictions → 選 **HTTP referrers (web sites)**
加入你的網域:
```
https://*.vercel.app/*
https://your-custom-domain.com/*
http://localhost:3000/*
```

### API restrictions → 選 **Restrict key**,只勾:
- Maps JavaScript API
- (以後要用才加 Places / Geocoding)

## 5. 設定配額上限(防盜刷)
**APIs & Services → Quotas** → 找 Maps JavaScript API:
- `Map loads per day`:建議設 **1000**(個人用綽綽有餘)

## 6. 計費
- Google 每月給 **$200 免費額度**,Maps JS API 每 1000 次載入 $7
- 個人家族網站不會超過(每月約 28,500 次免費)
- 但**仍必須**綁信用卡,不然 API 不會啟用 — 這點很煩

## 7. 把 Key 放到 Vercel
```
Vercel Dashboard → 你的專案 → Settings → Environment Variables

Name:  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
Value: AIzaSy...（貼上 key）
Env:   Production, Preview, Development 三個都勾
```

設完後重新 deploy 一次(Vercel 會提示)。

## 8. 本地開發
```bash
# 在 nextjs/ 根目錄
cp .env.example .env.local
# 打開 .env.local,把 key 貼進去
# 然後 npm run dev
```

`.env.local` 已在 `.gitignore` 不會被 commit。

## 如果還沒設 key 會怎樣?
`HomeMap` 會自動 fallback 成靜態版 — 顯示一個訊息卡片 + 年份清單,網站仍然正常能用。

## Troubleshooting
- **"This page can't load Google Maps correctly"** → key 沒啟用 Maps JavaScript API,或 referrer 限制擋到當前網域
- **灰色地圖** → key 有效但沒啟用 Maps JS API
- **"For development purposes only" 浮水印** → 還沒綁信用卡(必須綁)
