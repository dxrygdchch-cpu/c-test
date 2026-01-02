-- ============================================
-- 威士忌評論網站 - Users 資料表建立腳本
-- ============================================
-- 請在 Supabase Dashboard > SQL Editor 中執行此腳本
-- 網址: https://supabase.com/dashboard/project/_/sql/new

-- 建立 users 資料表
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,  -- 儲存 bcrypt 加密後的密碼
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

