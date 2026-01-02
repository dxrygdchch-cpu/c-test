import { NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

export async function POST(request: Request) {
  console.log('[API] 收到註冊請求')
  
  try {
    const body = await request.json()
    const { email, password, name } = body

    console.log('[API] 請求資料:', {
      email: email || '未提供',
      name: name || '未提供',
      password: password ? '已提供' : '未提供',
    })

    if (!email || !password || !name) {
      console.log('[API] ❌ 請求失敗: 缺少必要欄位')
      return NextResponse.json(
        { error: '請填寫所有欄位' },
        { status: 400 }
      )
    }

    console.log('[API] 呼叫 registerUser...')
    const result = await registerUser(email, password, name)

    if (!result.success) {
      console.log(`[API] ❌ 註冊失敗: ${result.error}`)
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    console.log('[API] ✓ 註冊成功')
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API] ❌ 註冊過程中發生錯誤:', error)
    return NextResponse.json(
      { error: '註冊失敗，請稍後再試' },
      { status: 500 }
    )
  }
}

