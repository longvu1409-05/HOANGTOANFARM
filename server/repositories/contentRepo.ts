import { requireSupabaseClient } from '../db/supabaseClient.js';
import { KnowledgeArticleRecord, ReviewRecord } from '../types/backend.types.js';
import { slugifyVietnamese } from '../utils/formatters.js';

export const contentRepo = {
  async getAllReviews(): Promise<ReviewRecord[]> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('id', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: Number(r.id),
      author: String(r.author),
      quote: String(r.quote),
      rating: Number(r.rating ?? 5),
      avatar_file: String(r.avatar_file ?? 'imgEllipse47.png'),
      created_at: String(r.created_at ?? ''),
    }));
  },

  async createReview(author: string, quote: string, rating = 5): Promise<ReviewRecord> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('reviews')
      .insert({ author, quote, rating, avatar_file: 'imgEllipse47.png' })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return {
      id: Number(data.id),
      author: String(data.author),
      quote: String(data.quote),
      rating: Number(data.rating),
      avatar_file: String(data.avatar_file),
      created_at: String(data.created_at),
    };
  },

  async getAllKnowledgeArticles(): Promise<KnowledgeArticleRecord[]> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('knowledge_articles')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map((a) => ({
      id: String(a.id),
      title: String(a.title),
      excerpt: String(a.excerpt),
      content: String(a.content),
      image_file: String(a.image_file),
      is_featured: Number(a.is_featured ?? 0),
      created_at: String(a.created_at ?? ''),
    }));
  },

  async getKnowledgeArticleById(id: string): Promise<KnowledgeArticleRecord | undefined> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('knowledge_articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data
      ? {
          id: String(data.id),
          title: String(data.title),
          excerpt: String(data.excerpt),
          content: String(data.content),
          image_file: String(data.image_file),
          is_featured: Number(data.is_featured ?? 0),
          created_at: String(data.created_at ?? ''),
        }
      : undefined;
  },

  async createKnowledgeArticle(params: {
    title: string;
    excerpt: string;
    content: string;
    imageFile?: string;
  }): Promise<KnowledgeArticleRecord> {
    const supabase = requireSupabaseClient();
    const id = slugifyVietnamese(params.title);
    const { data, error } = await supabase
      .from('knowledge_articles')
      .insert({
        id,
        title: params.title,
        excerpt: params.excerpt,
        content: params.content,
        image_file: params.imageFile || 'imgRectangle222.png',
        is_featured: 0,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return {
      id: String(data.id),
      title: String(data.title),
      excerpt: String(data.excerpt),
      content: String(data.content),
      image_file: String(data.image_file),
      is_featured: Number(data.is_featured ?? 0),
      created_at: String(data.created_at ?? ''),
    };
  },
};
