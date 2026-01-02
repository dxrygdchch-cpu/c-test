# Whiskies 資料表結構說明

## 資料表名稱
`whiskies` (注意是複數形式)

## 必要欄位

```sql
CREATE TABLE whiskies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  flavor_tags TEXT[] NOT NULL,  -- 或使用 JSON 格式
  average_rating NUMERIC(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  rating_distribution JSONB DEFAULT '{"5": 0, "4": 0, "3": 0, "2": 0, "1": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 欄位說明

| 欄位名稱 | 類型 | 說明 |
|---------|------|------|
| `id` | UUID | 主鍵，自動產生 |
| `name` | TEXT | 酒款名稱 |
| `image` | TEXT | 圖片 URL (base64 或外部 URL) |
| `price` | NUMERIC | 價格 |
| `description` | TEXT | 描述 |
| `flavor_tags` | TEXT[] | 風味標籤陣列 |
| `average_rating` | NUMERIC | 平均評分 |
| `total_reviews` | INTEGER | 評論總數 |
| `rating_distribution` | JSONB | 評分分佈 |
| `created_at` | TIMESTAMP | 建立時間 |
| `updated_at` | TIMESTAMP | 更新時間 |

## 如果資料表欄位不同

如果您的資料表使用不同的欄位名稱，請修改 `lib/whiskeyStorage.ts` 中的 `fromSupabase` 和 `toSupabase` 函數來對應正確的欄位名稱。

