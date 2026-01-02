// 簡單的 Supabase 連線測試腳本
// 執行: npx tsx scripts/test-supabase.ts

import { supabase } from '../lib/supabase'

async function testConnection() {
  console.log('🔍 測試 Supabase 連線...\n')

  try {
    // 測試查詢 users 表
    console.log('1. 測試查詢 users 表...')
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      if (error.code === '42P01') {
        console.log('❌ 錯誤: users 資料表不存在！')
        console.log('   請先執行 supabase-schema.sql 中的 SQL 腳本建立資料表。\n')
      } else {
        console.log('❌ 查詢錯誤:', error.message)
        console.log('   錯誤代碼:', error.code)
      }
      return
    }

    console.log('✅ Supabase 連線成功！\n')
    console.log('2. 查詢現有用戶數量...')
    
    const { count, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.log('⚠️  無法取得用戶數量:', countError.message)
    } else {
      console.log(`✅ 目前有 ${count || 0} 個用戶\n`)
    }

    console.log('✅ 所有測試通過！Supabase 已正確設定。')
  } catch (error) {
    console.error('❌ 測試失敗:', error)
  }
}

testConnection()

