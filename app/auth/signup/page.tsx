'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 驗證密碼
    if (password !== confirmPassword) {
      setError('這兩個密碼不相符，請再試一次')
      return
    }

    if (password.length < 6) {
      setError('請選擇長度至少 6 個字元的密碼')
      return
    }

    setLoading(true)

    try {
      // 註冊用戶
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        setError(registerData.error || '註冊失敗，請稍後再試')
        setLoading(false)
        return
      }

      // 註冊成功後自動登入
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('註冊成功，但登入失敗，請手動登入')
        router.push('/auth/signin')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('註冊失敗，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[450px]">
        {/* Logo/標題區域 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-normal text-gray-900 mb-2">
            建立帳號
          </h1>
          <p className="text-base text-gray-900">
            繼續使用威士忌評論網站
          </p>
        </div>

        {/* 表單卡片 */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 sm:p-10 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 姓名輸入框 */}
            <div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition-all"
                placeholder="姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email 輸入框 */}
            <div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition-all"
                placeholder="電子郵件地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* 密碼輸入框 */}
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition-all"
                placeholder="密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#1a73e8] font-medium hover:underline"
                >
                  {showPassword ? '隱藏' : '顯示'}
                </button>
              )}
            </div>

            {/* 確認密碼輸入框 */}
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition-all"
                placeholder="確認"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#1a73e8] font-medium hover:underline"
                >
                  {showConfirmPassword ? '隱藏' : '顯示'}
                </button>
              )}
            </div>

            {/* 密碼提示 */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>密碼必須至少 6 個字元</p>
            </div>

            {/* 錯誤訊息 */}
            {error && (
              <div className="bg-[#fce8e6] border border-[#f28b82] rounded px-4 py-3">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#d93025] mt-0.5 mr-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-[#d93025]">{error}</p>
                </div>
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/auth/signin"
                className="text-sm text-[#1a73e8] font-medium hover:bg-[#f8f9fa] px-4 py-2 rounded"
              >
                登入
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium px-8 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? '註冊中...' : '下一步'}
              </button>
            </div>
          </form>
        </div>

        {/* 使用條款說明 */}
        <div className="mt-6 text-xs text-gray-600 text-center px-8">
          <p>
            繼續即表示您同意遵守威士忌評論網站的{' '}
            <Link href="#" className="text-[#1a73e8] hover:underline">
              服務條款
            </Link>{' '}
            和{' '}
            <Link href="#" className="text-[#1a73e8] hover:underline">
              隱私權政策
            </Link>
          </p>
        </div>

        {/* 頁尾資訊 */}
        <div className="mt-8 text-center text-xs text-gray-600 space-x-4">
          <button className="hover:underline">繁體中文</button>
          <span>•</span>
          <button className="hover:underline">說明</button>
          <span>•</span>
          <button className="hover:underline">隱私權</button>
          <span>•</span>
          <button className="hover:underline">條款</button>
        </div>
      </div>
    </div>
  )
}

