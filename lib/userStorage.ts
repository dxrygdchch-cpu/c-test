import { supabase, User } from './supabase'

// 根據 email 查找用戶
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    console.log(`[Supabase] 查找用戶: ${email}`)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // 找不到記錄
        console.log(`[Supabase] 用戶不存在: ${email}`)
        return null
      }
      console.error('[Supabase] 查詢用戶失敗:', error)
      throw error
    }

    console.log(`[Supabase] ✓ 找到用戶: ${data.email} (ID: ${data.id})`)
    return data as User
  } catch (error) {
    console.error('[Supabase] 查詢用戶時發生錯誤:', error)
    throw error
  }
}

// 根據 id 查找用戶
export async function getUserById(id: string): Promise<User | null> {
  try {
    console.log(`[Supabase] 根據 ID 查找用戶: ${id}`)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        console.log(`[Supabase] 用戶不存在: ${id}`)
        return null
      }
      console.error('[Supabase] 查詢用戶失敗:', error)
      throw error
    }

    return data as User
  } catch (error) {
    console.error('[Supabase] 查詢用戶時發生錯誤:', error)
    throw error
  }
}

// 建立新用戶
export async function createUser(
  email: string,
  name: string,
  passwordHash: string
): Promise<User> {
  try {
    console.log(`[Supabase] 建立新用戶: ${email}`)
    
    // 檢查用戶是否已存在
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      throw new Error('Email 已被使用')
    }

    const newUser = {
      email: email.toLowerCase().trim(),
      name,
      password_hash: passwordHash,
    }

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single()

    if (error) {
      console.error('[Supabase] 建立用戶失敗:', error)
      throw error
    }

    console.log(`[Supabase] ✓ 用戶建立成功: ${data.email} (ID: ${data.id})`)
    return data as User
  } catch (error) {
    console.error('[Supabase] 建立用戶時發生錯誤:', error)
    throw error
  }
}

// 更新用戶
export async function updateUser(id: string, updates: Partial<User>): Promise<User> {
  try {
    console.log(`[Supabase] 更新用戶: ${id}`)
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Supabase] 更新用戶失敗:', error)
      throw error
    }

    console.log(`[Supabase] ✓ 用戶更新成功: ${data.email}`)
    return data as User
  } catch (error) {
    console.error('[Supabase] 更新用戶時發生錯誤:', error)
    throw error
  }
}
