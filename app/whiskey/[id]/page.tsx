'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import StarRating from '@/components/StarRating'
import RatingDistribution from '@/components/RatingDistribution'
import ReviewForm from '@/components/ReviewForm'
import ReviewList from '@/components/ReviewList'
import { Whiskey, Review } from '@/types'
import { supabase } from '@/lib/supabase'

export default function WhiskeyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [whiskey, setWhiskey] = useState<Whiskey | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setIsLoading(true);

        // 1. 從 Supabase 抓取酒款資料
        const { data: whiskeyData, error: whiskeyError } = await supabase
          .from('whiskies')
          .select('*')
          .eq('id', id)
          .single();

        if (whiskeyError) throw whiskeyError;

        if (whiskeyData) {
          // ✨ 核心修正：將資料庫欄位 (底線) 轉為前端變數 (駝峰)，並提供預設值防止崩潰
          const safeWhiskey: Whiskey = {
            ...whiskeyData,
            ratingDistribution: whiskeyData.rating_distribution || whiskeyData.ratingDistribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
            totalReviews: whiskeyData.total_reviews || whiskeyData.totalReviews || 0,
            averageRating: whiskeyData.average_rating || whiskeyData.averageRating || 0,
            flavorTags: whiskeyData.flavor_tags || whiskeyData.flavorTags || []
          };
          
          setWhiskey(safeWhiskey);

          // 2. 抓取評論
          const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .eq('whiskey_id', id)
            .order('created_at', { ascending: false });

          if (reviewsError) throw reviewsError;
          if (reviewsData) setReviews(reviewsData);
        }
      } catch (error) {
        console.error("載入詳情失敗:", error);
      } finally {
        // ✨ 確保關閉載入狀態，解決「載入中」問題
        setIsLoading(false); 
      }
    }

    loadData();
  }, [id]);

  const handleReviewSubmit = async () => {
    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*')
      .eq('whiskey_id', id)
      .order('created_at', { ascending: false });
    if (reviewsData) setReviews(reviewsData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-medium text-gray-600">載入中...</div>
      </div>
    );
  }

  if (!whiskey) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">找不到該酒款資料</h1>
        <button onClick={() => router.push('/whiskey')} className="text-blue-600">返回酒款列表</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* 基本資訊卡片 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img src={whiskey.image} alt={whiskey.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:w-2/3">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{whiskey.name}</h1>
              <div className="flex items-center mb-4">
                <StarRating rating={whiskey.averageRating} />
                <span className="ml-2 text-gray-600">({whiskey.totalReviews} 則評論)</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-4">NT$ {whiskey.price?.toLocaleString()}</p>
              <p className="text-gray-600 mb-6">{whiskey.description}</p>
              <div className="flex flex-wrap gap-2">
                {whiskey.flavorTags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 評分與表單 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold mb-4">評分分佈</h2>
            <RatingDistribution 
              distribution={whiskey.ratingDistribution} 
              totalReviews={whiskey.totalReviews} 
            />
          </div>
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4">發表評價</h2>
            <ReviewForm whiskeyId={id} onSubmit={handleReviewSubmit} />
          </div>
        </div>

        {/* 評論列表 */}
        <div>
          <h2 className="text-2xl font-bold mb-6">全部評論 ({reviews.length})</h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  );
}