# Supabase 設定完整指南

## ✅ 已完成的設定

### 1. 環境變數設定
- ✅ `.env.local` 檔案已建立
- ✅ 包含 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Supabase 客戶端配置
- ✅ `lib/supabase.ts` 已建立並配置完成

### 3. 會員系統整合
- ✅ 註冊功能已整合 Supabase
- ✅ 登入功能已整合 Supabase
- ✅ 密碼使用 bcrypt 加密

## 📋 接下來需要執行的步驟

### 步驟 1: 在 Supabase 建立資料表

1. 登入 Supabase Dashboard: https://supabase.com/dashboard
2. 選擇您的專案: `hdjstzkhfphudkkalqqi`
3. 前往 **SQL Editor** (左側選單)
4. 點擊 **New Query**
5. 複製 `supabase-schema.sql` 檔案中的所有 SQL 指令
6. 貼上到 SQL Editor
7. 點擊 **Run** 執行

### 步驟 2: 驗證資料表建立成功

在 SQL Editor 中執行以下查詢確認：

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';
```

如果看到 `users` 表，表示建立成功！

### 步驟 3: 測試功能

1. 啟動開發伺服器：
```bash
npm run dev
```

2. 訪問註冊頁面：
   - 網址: http://localhost:3000/auth/signup
   - 填寫姓名、Email、密碼
   - 點擊「下一步」註冊

3. 查看終端機輸出：
   - 應該會看到 `[註冊]` 和 `[Supabase]` 的詳細日誌
   - 確認看到「✓ 用戶建立成功」

4. 在 Supabase Dashboard 驗證：
   - 前往 **Table Editor** > **users**
   - 應該能看到剛註冊的用戶（密碼已加密）

5. 測試登入：
   - 訪問: http://localhost:3000/auth/signin
   - 使用剛才註冊的 Email 和密碼登入
   - 查看終端機的 `[認證]` 日誌

## 🔍 資料表結構說明

```
users 表欄位：
- id (UUID): 主鍵，自動產生
- email (TEXT): 電子郵件，唯一值
- name (TEXT): 用戶姓名
- password_hash (TEXT): bcrypt 加密後的密碼
- created_at (TIMESTAMP): 建立時間
- updated_at (TIMESTAMP): 更新時間
```

## 🐛 疑難排解

### 問題 1: 環境變數未載入
**解決方法**: 重新啟動開發伺服器 (`npm run dev`)

### 問題 2: 找不到 users 表
**錯誤訊息**: `relation "users" does not exist`
**解決方法**: 確認已執行 `supabase-schema.sql` 中的 SQL

### 問題 3: RLS 政策錯誤
**錯誤訊息**: `new row violates row-level security policy`
**解決方法**: 確認 SQL 腳本中的 RLS 政策已正確建立

### 問題 4: 連線失敗
**解決方法**: 
- 檢查 `.env.local` 檔案中的 Supabase URL 和 Key 是否正確
- 確認 Supabase 專案狀態正常

## 📝 除錯訊息說明

系統會在終端機輸出詳細的除錯訊息：

- `[註冊]`: 註冊流程步驟
- `[Supabase]`: Supabase 資料庫操作
- `[認證]`: 登入驗證過程
- `[API]`: API 請求記錄

所有訊息都包含 ✓ (成功) 或 ❌ (失敗) 標記，方便追蹤問題。
