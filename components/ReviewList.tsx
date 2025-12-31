'use client'

import { Review } from '@/types'
import StarRating from './StarRating'

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">尚無評論</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3 mb-3">
              <img
                src={review.userAvatar}
                alt={review.userName}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{review.userName}</span>
                  <StarRating rating={review.rating} size={16} />
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>
            </div>

            {review.flavorTags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {review.flavorTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-700 mb-3 whitespace-pre-wrap">
              {review.comment}
            </p>

            {review.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {review.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`評論照片 ${index + 1}`}
                    className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => window.open(photo, '_blank')}
                  />
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

