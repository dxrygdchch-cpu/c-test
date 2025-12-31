# 威士忌評論網站

一個參考 Google Maps 商家評論介面設計的威士忌評論平台，使用 Next.js、React 和 Tailwind CSS 建置。

## 功能特色

### 核心功能
- ✅ **五星評分系統**：支援小數點評分（如 4.7 顆星），顯示評分分佈長條圖
- ✅ **評論系統**：使用者可撰寫文字評論並上傳多張照片
- ✅ **風味標籤**：評論時可選擇預設風味標籤（香蕉、芭樂、蓮霧、煙燻、泥煤、蜂蜜、香草、龍眼、奶油、柳丁）
- ✅ **新增酒款**：使用者可新增威士忌酒款，包含圖片、價格、介紹（200字內）和 10 個風味標籤

### 設計特色
- 極簡白色背景，卡片式設計
- 參考 Google Maps 商家評論介面
- 響應式設計，支援手機與桌面裝置

## 安裝與執行

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 建置生產版本
```bash
npm run build
npm start
```

## 專案結構

```
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 首頁
│   ├── globals.css         # 全域樣式
│   └── whiskey/
│       ├── [id]/page.tsx   # 酒款詳情頁
│       └── new/page.tsx    # 新增酒款頁
├── components/
│   ├── StarRating.tsx           # 星級評分組件
│   ├── RatingDistribution.tsx  # 評分分佈組件
│   ├── FlavorTagSelector.tsx    # 風味標籤選擇器
│   ├── ReviewForm.tsx          # 評論表單
│   └── ReviewList.tsx          # 評論列表
├── data/
│   └── flavorTags.ts       # 風味標籤資料
├── lib/
│   ├── storage.ts          # 本地儲存管理
│   └── initData.ts         # 初始化範例資料
└── types/
    └── index.ts            # TypeScript 型別定義
```

## 使用說明

### 查看酒款詳情
1. 從首頁點擊「範例酒款詳情頁面」或直接訪問 `/whiskey/1`
2. 查看酒款資訊、評分分佈和所有評論
3. 撰寫新評論並上傳照片

### 新增酒款
1. 從首頁點擊「新增酒款」或訪問 `/whiskey/new`
2. 填寫酒款名稱、上傳圖片、設定價格
3. 撰寫介紹（200字以內）
4. 選擇最多 10 個風味標籤
5. 提交後自動跳轉到新建立的酒款詳情頁

## 技術棧

- **Next.js 14** - React 框架
- **TypeScript** - 型別安全
- **Tailwind CSS** - 樣式框架
- **Lucide React** - 圖示庫
- **localStorage** - 資料儲存（開發用，實際專案應使用資料庫）

## 注意事項

- 目前使用 localStorage 儲存資料，重新整理頁面後資料會保留，但清除瀏覽器資料會遺失
- 圖片上傳使用 base64 編碼儲存，實際專案應使用雲端儲存服務
- 建議在實際部署時整合後端 API 和資料庫

