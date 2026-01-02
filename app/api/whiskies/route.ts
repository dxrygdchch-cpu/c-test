import { NextResponse } from 'next/server'
import { getAllWhiskeys, saveWhiskey } from '@/lib/whiskeyStorage'
import { Whiskey } from '@/types'

// GET: 取得所有酒款
export async function GET() {
  try {
    console.log('[API] 收到取得所有酒款請求')
    const whiskeys = await getAllWhiskeys()
    console.log(`[API] ✓ 返回 ${whiskeys.length} 個酒款`)
    return NextResponse.json(whiskeys)
  } catch (error) {
    console.error('[API] ❌ 取得酒款失敗:', error)
    return NextResponse.json(
      { error: '取得酒款失敗，請稍後再試' },
      { status: 500 }
    )
  }
}

// POST: 新增酒款
export async function POST(request: Request) {
  try {
    console.log('[API] 收到新增酒款請求')
    const whiskeyData: Whiskey = await request.json()

    console.log('[API] 驗證資料...')
    if (!whiskeyData.name || !whiskeyData.image || !whiskeyData.description) {
      return NextResponse.json(
        { error: '請填寫所有必要欄位' },
        { status: 400 }
      )
    }

    const savedWhiskey = await saveWhiskey(whiskeyData)
    console.log(`[API] ✓ 酒款新增成功: ${savedWhiskey.id}`)
    
    return NextResponse.json(savedWhiskey, { status: 201 })
  } catch (error) {
    console.error('[API] ❌ 新增酒款失敗:', error)
    return NextResponse.json(
      { error: '新增酒款失敗，請稍後再試' },
      { status: 500 }
    )
  }
}

