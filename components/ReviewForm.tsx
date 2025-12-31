'use client'

import { useState } from 'react'
import StarRating from './StarRating'
import FlavorTagSelector from './FlavorTagSelector'
import { Review } from '@/types'
import { storage } from '@/lib/storage'

interface ReviewFormProps {
  whiskeyId: string
  onSubmit: (review: Review) => void
}

export default function ReviewForm({ whiskeyId, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          setPhotos((prev) => [...prev, reader.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) {
      alert('請輸入評論內容')
      return
    }

    setIsSubmitting(true)

    const newReview: Review = {
      id: Date.now().toString(),
      whiskeyId,
      userId: 'user1',
      userName: '匿名使用者',
      userAvatar: `https://ui-avatars.com/api/?name=User&background=random`,
      rating,
      comment,
      photos,
      flavorTags: selectedTags,
      createdAt: new Date().toISOString(),
    }

    storage.saveReview(newReview)
    onSubmit(newReview)

    // 重置表單
    setRating(5)
    setComment('')
    setSelectedTags([])
    setPhotos([])
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">撰寫評論</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          評分
        </label>
        <StarRating
          rating={rating}
          interactive
          onRatingChange={setRating}
          showNumber
        />
      </div>

      <div className="mb-4">
        <FlavorTagSelector
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          maxTags={10}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          評論內容
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="分享您對這款威士忌的體驗..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          上傳照片（可選）
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoUpload}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {photos.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`上傳的照片 ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? '提交中...' : '提交評論'}
      </button>
    </form>
  )
}

