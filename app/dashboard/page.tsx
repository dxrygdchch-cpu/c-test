import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">個人後台</h1>
          <p className="mt-2 text-gray-600">
            歡迎回來，{session.user?.name}！
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 個人資料卡片 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              個人資料
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">姓名</p>
                <p className="text-gray-900 font-medium">{session.user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900 font-medium">{session.user?.email}</p>
              </div>
              <div className="pt-2">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  編輯個人資料
                </button>
              </div>
            </div>
          </div>

          {/* 我的評論卡片 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              我的評論
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                您還沒有任何評論
              </p>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-block"
              >
                開始評論 →
              </Link>
            </div>
          </div>

          {/* 我的收藏卡片 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              我的收藏
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600 text-sm">
                您還沒有收藏任何酒款
              </p>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-block"
              >
                瀏覽酒款 →
              </Link>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            快速操作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/whiskey/new"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">新增酒款</h3>
              <p className="text-sm text-gray-600">新增新的威士忌酒款到平台</p>
            </Link>
            <Link
              href="/"
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">瀏覽酒款</h3>
              <p className="text-sm text-gray-600">查看所有威士忌酒款</p>
            </Link>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <h3 className="font-medium text-gray-900 mb-1">設定</h3>
              <p className="text-sm text-gray-600">管理帳號設定與偏好</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

