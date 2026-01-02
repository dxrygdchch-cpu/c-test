# Supabase 設定指南

## 步驟 1: 在 Supabase Dashboard 建立資料表

1. 登入您的 Supabase Dashboard: https://supabase.com/dashboard
2. 選擇您的專案
3. 前往 **SQL Editor**
4. 執行 `supabase-schema.sql` 檔案中的 SQL 腳本

或者直接複製以下 SQL：

```sql
-- 建立 users 資料表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 建立索引以加速查詢
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

-- 建立 updated_at 自動更新函數
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 建立觸發器自動更新 updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 啟用 Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 建立政策：任何人都可以讀取（如果需要更嚴格的控制，可以修改此政策）
CREATE POLICY "Allow public read access" ON users
    FOR SELECT
    USING (true);

-- 建立政策：允許插入（註冊）
CREATE POLICY "Allow public insert" ON users
    FOR INSERT
    WITH CHECK (true);

-- 建立政策：允許更新自己的資料（如果需要）
CREATE POLICY "Allow users to update own data" ON users
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
```

## 步驟 2: 設定環境變數（可選）

在專案根目錄建立 `.env.local` 檔案（如果尚未建立）：

```env
NEXT_PUBLIC_SUPABASE_URL=https://hdjstzkhfphudkkalqqi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkanN0emtoZnBodWRra2FscXFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMDI4MzgsImV4cCI6MjA4Mjg3ODgzOH0.01EbTLVcSoIbqpLQOa0rStApzFZQ78on77KHPL_hEs0
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=AtLpDz3bHh0IzZLODMZLslwOT27lEqBNNO/oKSlcZdc=
```

**注意**：程式碼中已經包含了預設值，所以如果您不想設定環境變數，也可以直接使用。

## 步驟 3: 測試

1. 啟動開發伺服器：`npm run dev`
2. 訪問註冊頁面：http://localhost:3000/auth/signup
3. 註冊一個新帳號
4. 查看終端機的除錯訊息，確認資料已成功儲存到 Supabase
5. 嘗試登入

## 除錯

如果遇到問題，請檢查：
- Supabase Dashboard 中的資料表是否已建立
- 終端機的除錯訊息
- Supabase Dashboard > Logs 查看 API 請求記錄
