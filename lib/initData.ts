import { Whiskey } from '@/types'
import { storage } from './storage'

// 初始化範例資料
export function initSampleData() {
  if (typeof window === 'undefined') return

  // 檢查是否已經初始化過
  const existing = storage.getWhiskey('1')
  if (existing) return

  const sampleWhiskey: Whiskey = {
    id: '1',
    name: '麥卡倫 12 年單一麥芽威士忌',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67f54?w=400&h=400&fit=crop',
    price: 2500,
    description: '經典的雪莉桶熟成威士忌，散發著豐富的果香與香草氣息，口感圓潤順滑，尾韻悠長。適合初學者與威士忌愛好者品飲。',
    flavorTags: ['蜂蜜', '香草', '奶油', '焦糖', '橡木', '雪莉酒', '乾果', '香料', '巧克力', '烤杏仁'],
    averageRating: 4.5,
    totalReviews: 12,
    ratingDistribution: {
      5: 6,
      4: 4,
      3: 2,
      2: 0,
      1: 0,
    },
  }

  storage.saveWhiskey(sampleWhiskey)

  // 建立一些範例評論
  const sampleReviews = [
    {
      id: 'r1',
      whiskeyId: '1',
      userId: 'u1',
      userName: '威士忌愛好者',
      userAvatar: 'https://ui-avatars.com/api/?name=User1&background=0ea5e9&color=fff',
      rating: 5,
      comment: '非常棒的威士忌！香氣豐富，口感層次分明。特別喜歡它的蜂蜜和香草味道。',
      photos: ['https://images.unsplash.com/photo-1608270586620-248524c67f54?w=400&h=400&fit=crop'],
      flavorTags: ['蜂蜜', '香草', '奶油'],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r2',
      whiskeyId: '1',
      userId: 'u2',
      userName: '品酒新手',
      userAvatar: 'https://ui-avatars.com/api/?name=User2&background=8b5cf6&color=fff',
      rating: 4,
      comment: '作為新手，這款威士忌很適合入門。不會太烈，風味也很豐富。',
      photos: [],
      flavorTags: ['蜂蜜', '柳丁'],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'r3',
      whiskeyId: '1',
      userId: 'u3',
      userName: '收藏家',
      userAvatar: 'https://ui-avatars.com/api/?name=User3&background=10b981&color=fff',
      rating: 5,
      comment: '經典之作，值得收藏。雪莉桶的風味非常明顯，尾韻也很持久。',
      photos: [],
      flavorTags: ['雪莉酒', '焦糖', '橡木'],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  sampleReviews.forEach((review) => {
    storage.saveReview(review as any)
  })
}

