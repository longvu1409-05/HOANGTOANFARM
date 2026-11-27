import { apiRequest, withApiFallback } from './apiClient';
import { localFallbackStore } from './localFallbackStore';

export interface KnowledgeArticleDto {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_file: string;
  is_featured: number;
  created_at: string;
}

export interface ReviewDto {
  id: number;
  author: string;
  quote: string;
  rating: number;
  avatar_file: string;
  created_at: string;
}

export async function fetchKnowledgeArticles(): Promise<KnowledgeArticleDto[]> {
  return withApiFallback(
    async () => {
      const res = await apiRequest<KnowledgeArticleDto[]>('/api/content/knowledge');
      return res.data;
    },
    () => localFallbackStore.listKnowledge()
  );
}

export async function createKnowledgeArticle(payload: {
  title: string;
  excerpt: string;
  content: string;
  imageFile?: string;
}) {
  return withApiFallback(
    () =>
      apiRequest<KnowledgeArticleDto>('/api/content/knowledge', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    () => {
      const data = localFallbackStore.createKnowledge(payload);
      return { success: true, message: `Đã đăng bài viết "${data.title}".`, data };
    }
  );
}

export async function fetchReviews(): Promise<ReviewDto[]> {
  return withApiFallback(
    async () => {
      const res = await apiRequest<ReviewDto[]>('/api/content/reviews');
      return res.data;
    },
    () => localFallbackStore.listReviews()
  );
}

export async function createReview(payload: {
  author: string;
  quote: string;
  rating: number;
}) {
  return withApiFallback(
    () =>
      apiRequest<ReviewDto>('/api/content/reviews', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    () => {
      const data = localFallbackStore.createReview(payload);
      return {
        success: true,
        message: 'Cảm ơn bạn đã gửi đánh giá cho Hoàng Toàn Farm!',
        data,
      };
    }
  );
}
