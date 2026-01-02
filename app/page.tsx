import Link from 'next/link'
import { getAllWhiskeys } from '@/lib/whiskeyStorage'
import { Whiskey } from '@/types'

// Google 風格的評分顯示組件
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <svg
          key={`full-${i}`}
          className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-400 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      {hasHalfStar && (
        <svg
          className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-yellow-400 fill-current`}
          viewBox="0 0 20 20"
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="url(#half)"
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={`empty-${i}`}
          className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-300 fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
      {rating > 0 && (
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      )}
    </div>
  )
}

// Google 風格酒款卡片組件
function WhiskeyCard({ whiskey }: { whiskey: Whiskey }) {
  return (
    <Link
      href={`/whiskey/${whiskey.id}`}
      className="block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      <div className="flex">
        {/* 圖片 */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
          <img
            src={whiskey.image}
            alt={whiskey.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 內容 */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-normal text-gray-900 mb-1 line-clamp-2">
              {whiskey.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {whiskey.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            {/* 評分 */}
            <div className="flex items-center gap-2">
              {whiskey.averageRating > 0 ? (
                <>
                  <StarRating rating={whiskey.averageRating} size="sm" />
                  <span className="text-xs text-gray-500">
                    ({whiskey.totalReviews})
                  </span>
                </>
              ) : (
                <span className="text-xs text-gray-400">尚無評分</span>
              )}
            </div>

            {/* 價格 */}
            <div className="text-base font-medium text-gray-900">
              NT$ {whiskey.price.toLocaleString()}
            </div>
          </div>

          {/* 風味標籤 */}
          {whiskey.flavorTags && whiskey.flavorTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {whiskey.flavorTags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                >
                  {tag}
                </span>
              ))}
              {whiskey.flavorTags.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-gray-500">
                  +{whiskey.flavorTags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default async function Home() {
  let whiskeys: Whiskey[] = []
  
  try {
    whiskeys = await getAllWhiskeys()
  } catch (error) {
    console.error('載入酒款失敗:', error)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 標題與新增按鈕 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-normal text-gray-900 mb-2">
              威士忌評論網站
            </h1>
            <p className="text-base text-gray-600">
              {whiskeys.length > 0
                ? `共 ${whiskeys.length} 款威士忌`
                : '開始探索威士忌的世界'}
            </p>
          </div>
          <Link
            href="/whiskey/new"
            className="bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium px-6 py-2 rounded text-sm transition-colors shadow-sm"
          >
            新增酒款
          </Link>
        </div>

        {/* 酒款列表 */}
        {whiskeys.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              還沒有任何酒款
            </h3>
            <p className="text-gray-600 mb-6">
              開始新增您的第一款威士忌吧！
            </p>
            <Link
              href="/whiskey/new"
              className="inline-block bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium px-6 py-2 rounded text-sm transition-colors"
            >
              新增酒款
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {whiskeys.map((whiskey) => (
              <WhiskeyCard key={whiskey.id} whiskey={whiskey} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
