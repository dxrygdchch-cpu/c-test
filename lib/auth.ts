import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail, createUser } from './userStorage'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('[認證] 開始驗證登入請求')
        
        if (!credentials?.email || !credentials?.password) {
          console.log('[認證] ❌ 驗證失敗: 缺少 email 或 password')
          console.log('  - Email:', credentials?.email || '未提供')
          console.log('  - Password:', credentials?.password ? '已提供' : '未提供')
          return null
        }

        const email = credentials.email.toLowerCase().trim()
        console.log(`[認證] 查找用戶: ${email}`)

        try {
          // 查找用戶
          const user = await getUserByEmail(email)
          
          if (!user) {
            console.log(`[認證] ❌ 驗證失敗: 找不到用戶 ${email}`)
            return null
          }

          console.log(`[認證] ✓ 找到用戶: ${user.email} (ID: ${user.id})`)
          console.log('  - 用戶名稱:', user.name)
          console.log('  - 建立時間:', user.created_at)

          // 比對密碼
          console.log('[認證] 開始比對密碼...')
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)
          
          if (!isPasswordValid) {
            console.log('[認證] ❌ 驗證失敗: 密碼不匹配')
            console.log('  - 提供的密碼:', credentials.password ? `${credentials.password.substring(0, 2)}***` : '未提供')
            console.log('  - 儲存的密碼雜湊:', user.password_hash.substring(0, 20) + '...')
            return null
          }

          console.log('[認證] ✓ 密碼驗證成功')
          console.log('[認證] ✓ 登入驗證通過，返回用戶資訊')

          // 返回用戶資訊（密碼不會被包含在 JWT 中）
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('[認證] ❌ 驗證過程中發生錯誤:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

// 導出註冊函數（用於註冊頁面）
export async function registerUser(
  email: string, 
  password: string, 
  name: string
): Promise<{ success: boolean; error?: string }> {
  console.log('[註冊] 開始註冊流程')
  console.log('  - Email:', email)
  console.log('  - 姓名:', name)
  console.log('  - 密碼長度:', password.length)

  try {
    const emailLower = email.toLowerCase().trim()
    
    // 檢查用戶是否已存在
    console.log(`[註冊] 檢查 Email 是否已被使用: ${emailLower}`)
    const existingUser = await getUserByEmail(emailLower)
    
    if (existingUser) {
      console.log(`[註冊] ❌ 註冊失敗: Email ${emailLower} 已被使用`)
      return { success: false, error: '此 Email 已被使用' }
    }

    console.log('[註冊] ✓ Email 可用，開始加密密碼...')
    
    // 使用 bcrypt 加密密碼（10 rounds）
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    console.log('[註冊] ✓ 密碼加密完成')
    console.log('  - 密碼雜湊:', passwordHash.substring(0, 30) + '...')

    // 建立新用戶
    console.log('[註冊] 建立新用戶...')
    const newUser = await createUser(emailLower, name, passwordHash)
    
    console.log('[註冊] ✓ 用戶建立成功')
    console.log('  - 用戶 ID:', newUser.id)
    console.log('  - Email:', newUser.email)
    console.log('  - 姓名:', newUser.name)
    console.log('  - 建立時間:', newUser.created_at)

    return { success: true }
  } catch (error) {
    console.error('[註冊] ❌ 註冊失敗:', error)
    const errorMessage = error instanceof Error ? error.message : '註冊失敗，請稍後再試'
    return { success: false, error: errorMessage }
  }
}

