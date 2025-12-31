'use client'

import { Whiskey } from '@/types'

interface RatingDistributionProps {
  distribution: Whiskey['ratingDistribution']
  totalReviews: number
}

export default function RatingDistribution({
  distribution,
  totalReviews,
}: RatingDistributionProps) {
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0
    return (count / totalReviews) * 100
  }

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} className="flex items-center gap-2">
          <span className="text-sm text-gray-600 w-8">{star} 星</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${getPercentage(distribution[star as keyof typeof distribution])}%` }}
            />
          </div>
          <span className="text-sm text-gray-500 w-12 text-right">
            {distribution[star as keyof typeof distribution]}
          </span>
        </div>
      ))}
    </div>
  )
}

