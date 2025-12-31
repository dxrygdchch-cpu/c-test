'use client'

import { reviewFlavorTags } from '@/data/flavorTags'

interface FlavorTagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  maxTags?: number
}

export default function FlavorTagSelector({
  selectedTags,
  onTagsChange,
  maxTags = 10,
}: FlavorTagSelectorProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      if (selectedTags.length < maxTags) {
        onTagsChange([...selectedTags, tag])
      }
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        風味標籤（最多選擇 {maxTags} 個）
      </label>
      <div className="flex flex-wrap gap-2">
        {reviewFlavorTags.map((tag) => {
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
      {selectedTags.length > 0 && (
        <div className="mt-2 text-sm text-gray-500">
          已選擇：{selectedTags.join('、')}
        </div>
      )}
    </div>
  )
}

