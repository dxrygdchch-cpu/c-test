import { Whiskey, Review } from '@/types'

// 簡單的 localStorage 管理（實際專案應使用資料庫）
export const storage = {
  getWhiskeys: (): Whiskey[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('whiskeys')
    return data ? JSON.parse(data) : []
  },

  getWhiskey: (id: string): Whiskey | null => {
    const whiskeys = storage.getWhiskeys()
    return whiskeys.find(w => w.id === id) || null
  },

  saveWhiskey: (whiskey: Whiskey): void => {
    const whiskeys = storage.getWhiskeys()
    const index = whiskeys.findIndex(w => w.id === whiskey.id)
    if (index >= 0) {
      whiskeys[index] = whiskey
    } else {
      whiskeys.push(whiskey)
    }
    localStorage.setItem('whiskeys', JSON.stringify(whiskeys))
  },

  getReviews: (whiskeyId: string): Review[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(`reviews_${whiskeyId}`)
    return data ? JSON.parse(data) : []
  },

  saveReview: (review: Review): void => {
    const reviews = storage.getReviews(review.whiskeyId)
    reviews.push(review)
    localStorage.setItem(`reviews_${review.whiskeyId}`, JSON.stringify(reviews))
    
    // 更新酒款的評分統計
    const whiskey = storage.getWhiskey(review.whiskeyId)
    if (whiskey) {
      const allReviews = storage.getReviews(review.whiskeyId)
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
      whiskey.averageRating = totalRating / allReviews.length
      whiskey.totalReviews = allReviews.length
      
      // 更新評分分佈
      whiskey.ratingDistribution = {
        5: allReviews.filter(r => r.rating === 5).length,
        4: allReviews.filter(r => r.rating === 4).length,
        3: allReviews.filter(r => r.rating === 3).length,
        2: allReviews.filter(r => r.rating === 2).length,
        1: allReviews.filter(r => r.rating === 1).length,
      }
      
      storage.saveWhiskey(whiskey)
    }
  },
}

