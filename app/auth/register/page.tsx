'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('帳號或密碼不正確，請再試一次')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      setError('登入失敗，請稍後再試')
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
            登入
          </h1>
          <p className="text-base text-gray-900">
            使用您的威士忌評論帳號
          </p>
        </div>

        {/* 表單卡片 */}
        <div className="bg-white border border-gray-300 rounded-lg p-8 sm:p-10 shadow-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                required
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition-all"
                placeholder="請輸入密碼"
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

            {/* 忘記密碼連結 */}
            <div className="flex items-center justify-between">
              <Link
                href="/auth/signup"
                className="text-sm text-[#1a73e8] font-medium hover:bg-[#f8f9fa] px-2 py-1 rounded"
              >
                建立帳號
              </Link>
              <button
                type="button"
                className="text-sm text-[#1a73e8] font-medium hover:bg-[#f8f9fa] px-2 py-1 rounded"
              >
                忘記密碼？
              </button>
            </div>

            {/* 操作按鈕 */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href="/"
                className="text-sm text-[#1a73e8] font-medium hover:bg-[#f8f9fa] px-4 py-2 rounded"
              >
                返回
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium px-8 py-2 rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {loading ? '登入中...' : '下一步'}
              </button>
            </div>
          </form>
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

