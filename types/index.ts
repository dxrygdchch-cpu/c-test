export interface Whiskey {
  id: string
  name: string
  image: string
  price: number
  description: string
  flavorTags: string[]
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export interface Review {
  id: string
  whiskeyId: string
  userId: string
  userName: string
  userAvatar: string
  rating: number
  comment: string
  photos: string[]
  flavorTags: string[]
  createdAt: string
}

export interface User {
  id: string
  name: string
  avatar: string
}

