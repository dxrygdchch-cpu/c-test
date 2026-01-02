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

    try {
      const response = await fetch('/api/whiskies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          image: formData.image,
          price: parseFloat(formData.price),
          description: formData.description,
          flavorTags: selectedTags,
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || '新增失敗');

      const targetId = result.id || (result.data && result.data.id);

      if (targetId) {
        router.refresh();
        // ✨ 這裡已經修正為反引號 ` ，不會再跳 Pattern 錯誤
        router.push(`/whiskey/${targetId}`); 
      }
    } catch (error) {
      console.error('新增失敗:', error);
      alert(error instanceof Error ? error.message : '發生未知錯誤');
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">新增威士忌酒款</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border p-6 rounded-lg">
          <div>
            <label className="block mb-2 font-medium">酒款名稱 *</label>
            <input type="text" required value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-2 font-medium">圖片 *</label>
            <input type="file" required accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
            {imagePreview && <img src={imagePreview} className="mt-4 w-40 h-40 object-cover rounded" />}
          </div>
          <div>
            <label className="block mb-2 font-medium">價格 (NT$) *</label>
            <input type="number" required value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block mb-2 font-medium">介紹 *</label>
            <textarea required value={formData.description} onChange={(e)=>setFormData({...formData, description: e.target.value})} className="w-full border p-2 rounded" rows={4} />
          </div>
          <div>
            <label className="block mb-2 font-medium">風味標籤 (最多 10 個)</label>
            <div className="flex flex-wrap gap-2 border p-4 rounded max-h-40 overflow-y-auto">
              {allFlavorTags.map(tag => (
                <button key={tag} type="button" onClick={()=>toggleTag(tag)} className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>{tag}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-2 rounded disabled:bg-gray-400">
              {isSubmitting ? '提交中...' : '確認新增'}
            </button>
            <button type="button" onClick={()=>router.back()} className="px-6 py-2 border rounded">取消</button>
          </div>
        </form>
      </div>
    </div>
  )
}