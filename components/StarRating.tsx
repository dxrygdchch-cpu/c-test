'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  size?: number
  showNumber?: boolean
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export default function StarRating({
  rating,
  size = 20,
  showNumber = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return (
              <Star
                key={index}
                size={size}
                className={`fill-yellow-400 text-yellow-400 ${
                  interactive ? 'cursor-pointer hover:scale-110' : ''
                }`}
                onClick={() => handleClick(index)}
              />
            )
          } else if (index === fullStars && hasHalfStar) {
            return (
              <div key={index} className="relative">
                <Star
                  size={size}
                  className="fill-gray-300 text-gray-300"
                />
                <Star
                  size={size}
                  className="absolute top-0 left-0 fill-yellow-400 text-yellow-400"
                  style={{ clipPath: 'inset(0 50% 0 0)' }}
                />
              </div>
            )
          } else {
            return (
              <Star
                key={index}
                size={size}
                className={`fill-gray-300 text-gray-300 ${
                  interactive ? 'cursor-pointer hover:scale-110' : ''
                }`}
                onClick={() => handleClick(index)}
              />
            )
          }
        })}
      </div>
      {showNumber && (
        <span className="ml-1 text-sm text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

