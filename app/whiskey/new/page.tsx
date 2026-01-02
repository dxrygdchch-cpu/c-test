'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.image || !formData.price) {
      alert('請填寫完整資訊並上傳圖片');
      return;
    }

    setIsSubmitting(true);

    const newWhiskey = {
      name: formData.name,
      image: formData.image,
      price: parseFloat(formData.price),
      description: formData.description,
      flavorTags: selectedTags,
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
    };

    try {
      const response = await fetch('/api/whiskies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWhiskey),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '新增失敗');
      }

      // 4. ✨ 核心修正：判斷 ID 並確保跳轉
      const targetId = result.id || (result.data && result.data.id);

      if (targetId) {
        router.refresh();
        // ✨ 務必確保這裡使用反引號 ` (在鍵盤 Esc 下方)
        router.push(`/whiskey/${targetId}`); 
      } else {
        console.error('API 回傳異常:', result);
        throw new Error('儲存成功但無法取得 ID');
      }

    } catch (error) {
      console.error('新增失敗:', error);
      alert(error instanceof Error ? error.message : '發生未知錯誤');
      setIsSubmitting(false); 
    } finally {
      // 確保如果留在本頁，3 秒後恢復按鈕
      setTimeout(() => setIsSubmitting(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">新增威士忌酒款</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-6">
            {/* 酒款名稱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">酒款名稱 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* 酒款圖片 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">酒款圖片 *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
                required
              />
              {imagePreview && (
                <div className="mt-4">
                  <img src={imagePreview} alt="預覽" className="w-64 h-64 object-cover rounded-lg border border-gray-200" />
                </div>
              )}
            </div>

            {/* 價格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">價格 (NT$) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* 介紹 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">介紹 (200 字以內) *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* 風味標籤 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">風味標籤 (最多 10 個)</label>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 flex flex-wrap gap-2">
                {allFlavorTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 按鈕 */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? '提交中...' : '新增酒款'}
              </button>
              <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-gray-300 rounded-lg">取消</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}