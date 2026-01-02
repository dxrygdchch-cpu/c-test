'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Whiskey } from '@/types'
import { allFlavorTags } from '@/data/flavorTags'

export default function NewWhiskeyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    price: '',
    description: '',
  })
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          const imageUrl = reader.result as string
          setImagePreview(imageUrl)
          setFormData((prev) => ({ ...prev, image: imageUrl }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      if (selectedTags.length < 10) {
        setSelectedTags([...selectedTags, tag])
      } else {
        alert('最多只能選擇 10 個風味標籤')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('請輸入酒款名稱')
      return
    }
    if (!formData.image) {
      alert('請上傳酒款圖片')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('請輸入有效的價格')
      return
    }
    if (!formData.description.trim()) {
      alert('請輸入酒款介紹')
      return
    }
    if (formData.description.length > 200) {
      alert('介紹不能超過 200 字')
      return
    }
    if (selectedTags.length === 0) {
      alert('請至少選擇一個風味標籤')
      return
    }
    if (selectedTags.length > 10) {
      alert('最多只能選擇 10 個風味標籤')
      return
    }

    setIsSubmitting(true)

    try {
      const newWhiskey: Whiskey = {
        id: '', // 讓 Supabase 自動產生 ID
        name: formData.name,
        image: formData.image,
        price: parseFloat(formData.price),
        description: formData.description,
        flavorTags: selectedTags,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
      }

      // 透過 API 儲存到 Supabase
      const response = await fetch('/api/whiskeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWhiskey),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || '新增失敗')
      }

      const savedWhiskey = await response.json()
      
      // 重新整理頁面資料
      router.refresh()
      
      // 導向到新建立的酒款詳情頁
      router.push(`/whiskey/${savedWhiskey.id}`)
    } catch (error) {
      console.error('新增酒款失敗:', error)
      alert(error instanceof Error ? error.message : '新增失敗，請稍後再試')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">新增威士忌酒款</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-6">
            {/* 酒款名稱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒款名稱 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：麥卡倫 12 年"
                required
              />
            </div>

            {/* 酒款圖片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                酒款圖片 *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="預覽"
                    className="w-64 h-64 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            {/* 價格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                價格 (NT$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例如：2500"
                required
              />
            </div>

            {/* 介紹 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                介紹 (200 字以內) *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="請描述這款威士忌的特色..."
                required
              />
              <div className="mt-1 text-sm text-gray-500 text-right">
                {formData.description.length} / 200
              </div>
            </div>

            {/* 風味標籤選擇器 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                風味標籤 (請選擇 10 個) *
              </label>
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {allFlavorTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                          isSelected
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                已選擇 {selectedTags.length} / 10 個標籤
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  已選擇：{selectedTags.join('、')}
                </div>
              )}
            </div>

            {/* 提交按鈕 */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '提交中...' : '新增酒款'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

