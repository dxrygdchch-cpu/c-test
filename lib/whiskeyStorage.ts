import { supabase } from './supabase'
import { Whiskey } from '@/types'

// Supabase 中的 Whiskey 資料表類型
export interface SupabaseWhiskey {
  id: string
  name: string
  image: string
  price: number
  description: string
  flavor_tags: string[] // Supabase 中儲存為 JSON 或 TEXT[]
  average_rating: number
  total_reviews: number
  rating_distribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  created_at: string
  updated_at: string
}

// 將 Supabase 格式轉換為應用程式格式
function fromSupabase(supabaseWhiskey: SupabaseWhiskey): Whiskey {
  return {
    id: supabaseWhiskey.id,
    name: supabaseWhiskey.name,
    image: supabaseWhiskey.image,
    price: supabaseWhiskey.price,
    description: supabaseWhiskey.description,
    flavorTags: supabaseWhiskey.flavor_tags,
    averageRating: supabaseWhiskey.average_rating,
    totalReviews: supabaseWhiskey.total_reviews,
    ratingDistribution: supabaseWhiskey.rating_distribution,
  }
}

// 將應用程式格式轉換為 Supabase 格式
function toSupabase(whiskey: Whiskey): Omit<SupabaseWhiskey, 'id' | 'created_at' | 'updated_at'> {
  return {
    name: whiskey.name,
    image: whiskey.image,
    price: whiskey.price,
    description: whiskey.description,
    flavor_tags: whiskey.flavorTags,
    average_rating: whiskey.averageRating,
    total_reviews: whiskey.totalReviews,
    rating_distribution: whiskey.ratingDistribution,
  }
}

// 取得所有酒款
export async function getAllWhiskeys(): Promise<Whiskey[]> {
  try {
    console.log('[Supabase] 查詢所有酒款...')
    const { data, error } = await supabase
      .from('whiskies')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Supabase] 查詢酒款失敗:', error)
      throw error
    }

    console.log(`[Supabase] ✓ 找到 ${data?.length || 0} 個酒款`)
    return (data || []).map(fromSupabase)
  } catch (error) {
    console.error('[Supabase] 查詢酒款時發生錯誤:', error)
    throw error
  }
}

// 根據 ID 取得單一酒款
export async function getWhiskeyById(id: string): Promise<Whiskey | null> {
  try {
    console.log(`[Supabase] 查詢酒款: ${id}`)
    const { data, error } = await supabase
      .from('whiskies')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`[Supabase] 酒款不存在: ${id}`)
        return null
      }
      console.error('[Supabase] 查詢酒款失敗:', error)
      throw error
    }

    console.log(`[Supabase] ✓ 找到酒款: ${data.name}`)
    return fromSupabase(data as SupabaseWhiskey)
  } catch (error) {
    console.error('[Supabase] 查詢酒款時發生錯誤:', error)
    throw error
  }
}

// 儲存酒款（新增或更新）
export async function saveWhiskey(whiskey: Whiskey): Promise<Whiskey> {
  try {
    console.log(`[Supabase] 儲存酒款: ${whiskey.name}`)
    
    const supabaseData = toSupabase(whiskey)
    
    // 檢查是否為更新（有 id）
    if (whiskey.id) {
      const { data, error } = await supabase
        .from('whiskies')
        .update(supabaseData)
        .eq('id', whiskey.id)
        .select()
        .single()

      if (error) {
        console.error('[Supabase] 更新酒款失敗:', error)
        throw error
      }

      console.log(`[Supabase] ✓ 酒款更新成功: ${data.name}`)
      return fromSupabase(data as SupabaseWhiskey)
    } else {
      // 新增酒款
      const { data, error } = await supabase
        .from('whiskies')
        .insert(supabaseData)
        .select()
        .single()

      if (error) {
        console.error('[Supabase] 新增酒款失敗:', error)
        throw error
      }

      console.log(`[Supabase] ✓ 酒款新增成功: ${data.name} (ID: ${data.id})`)
      return fromSupabase(data as SupabaseWhiskey)
    }
  } catch (error) {
    console.error('[Supabase] 儲存酒款時發生錯誤:', error)
    throw error
  }
}

// 刪除酒款
export async function deleteWhiskey(id: string): Promise<void> {
  try {
    console.log(`[Supabase] 刪除酒款: ${id}`)
    const { error } = await supabase
      .from('whiskies')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[Supabase] 刪除酒款失敗:', error)
      throw error
    }

    console.log(`[Supabase] ✓ 酒款刪除成功`)
  } catch (error) {
    console.error('[Supabase] 刪除酒款時發生錯誤:', error)
    throw error
  }
}

