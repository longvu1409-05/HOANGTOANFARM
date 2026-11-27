import { apiRequest } from './apiClient';

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
  const res = await apiRequest<KnowledgeArticleDto[]>('/api/content/knowledge');
  return res.data;
}

export async function createKnowledgeArticle(payload: {
  title: string;
  excerpt: string;
  content: string;
  imageFile?: string;
  notifySubscribers?: boolean;
}) {
  return apiRequest<KnowledgeArticleDto>('/api/content/knowledge', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchReviews(): Promise<ReviewDto[]> {
  const res = await apiRequest<ReviewDto[]>('/api/content/reviews');
  return res.data;
}

export async function createReview(payload: {
  author: string;
  quote: string;
  rating: number;
}) {
  return apiRequest<ReviewDto>('/api/content/reviews', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
