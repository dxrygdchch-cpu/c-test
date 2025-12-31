'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import StarRating from '@/components/StarRating'
import RatingDistribution from '@/components/RatingDistribution'
import ReviewForm from '@/components/ReviewForm'
import ReviewList from '@/components/ReviewList'
import { Whiskey, Review } from '@/types'
import { storage } from '@/lib/storage'
import { initSampleData } from '@/lib/initData'

export default function WhiskeyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const [whiskey, setWhiskey] = useState<Whiskey | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // 初始化範例資料（僅在第一次載入時）
    initSampleData()
    
    const whiskeyData = storage.getWhiskey(id)
    if (whiskeyData) {
      setWhiskey(whiskeyData)
      const reviewsData = storage.getReviews(id)
      setReviews(reviewsData.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ))
    }
  }, [id])

  const handleReviewSubmit = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev])
    // 重新載入酒款資料以更新評分
    const updatedWhiskey = storage.getWhiskey(id)
    if (updatedWhiskey) {
      setWhiskey(updatedWhiskey)
    }
  }

  if (!whiskey) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-500">載入中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 上方：官方資訊卡片 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={whiskey.image}
                alt={whiskey.name}
                className="w-full md:w-64 h-64 object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{whiskey.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={whiskey.averageRating} size={24} showNumber />
                <span className="text-gray-600">
                  {whiskey.totalReviews} 則評論
                </span>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-semibold text-gray-900">
                  NT$ {whiskey.price.toLocaleString()}
                </span>
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                {whiskey.description}
              </p>

              {whiskey.flavorTags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    風味標籤
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {whiskey.flavorTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 評分分佈 */}
        {whiskey.totalReviews > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">評分分佈</h2>
            <RatingDistribution
              distribution={whiskey.ratingDistribution}
              totalReviews={whiskey.totalReviews}
            />
          </div>
        )}

        {/* 評論表單 */}
        <div className="mb-6">
          <ReviewForm whiskeyId={id} onSubmit={handleReviewSubmit} />
        </div>

        {/* 評論列表 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            評論 ({reviews.length})
          </h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}

