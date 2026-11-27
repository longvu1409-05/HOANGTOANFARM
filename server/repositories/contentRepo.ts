import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { getSupabaseClient } from '../db/supabaseClient';
import { KnowledgeArticleRecord, ReviewRecord } from '../types/backend.types';
import { slugifyVietnamese } from '../utils/formatters';

/**
 * Truy vấn bài viết kiến thức & đánh giá khách hàng
 */
export const contentRepo = {
  async getAllReviews(): Promise<ReviewRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw new Error(`Lỗi đọc đánh giá Supabase: ${error.message}`);
      return (data ?? []).map((r) => ({
        id: Number(r.id),
        author: String(r.author),
        quote: String(r.quote),
        rating: Number(r.rating ?? 5),
        avatar_file: String(r.avatar_file ?? 'imgEllipse47.png'),
        created_at: String(r.created_at ?? ''),
      }));
    }

    const db = getSqliteDb();
    if (db) {
      return db.prepare('SELECT * FROM reviews ORDER BY id DESC').all() as unknown as ReviewRecord[];
    }

    return [...getJsonStore().reviews].sort((a, b) => b.id - a.id);
  },

  async createReview(author: string, quote: string, rating = 5): Promise<ReviewRecord> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .insert({ author, quote, rating, avatar_file: 'imgEllipse47.png' })
        .select('*')
        .single();
      if (error) throw new Error(`Không thể gửi đánh giá lên Supabase: ${error.message}`);
      return {
        id: Number(data.id),
        author: String(data.author),
        quote: String(data.quote),
        rating: Number(data.rating),
        avatar_file: String(data.avatar_file),
        created_at: String(data.created_at),
      };
    }

    const db = getSqliteDb();
    if (db) {
      const result = db
        .prepare('INSERT INTO reviews (author, quote, rating) VALUES (?, ?, ?)')
        .run(author, quote, rating);
      return db
        .prepare('SELECT * FROM reviews WHERE id = ?')
        .get(Number(result.lastInsertRowid)) as unknown as ReviewRecord;
    }

    const store = getJsonStore();
    const record: ReviewRecord = {
      id: ++store.counters.reviewId,
      author,
      quote,
      rating,
      avatar_file: 'imgEllipse47.png',
      created_at: nowTimestamp(),
    };
    store.reviews.unshift(record);
    saveJsonStore();
    return record;
  },

  async getAllKnowledgeArticles(): Promise<KnowledgeArticleRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: true });
      if (error) throw new Error(`Lỗi đọc bài viết Supabase: ${error.message}`);
      return (data ?? []).map((a) => ({
        id: String(a.id),
        title: String(a.title),
        excerpt: String(a.excerpt),
        content: String(a.content),
        image_file: String(a.image_file),
        is_featured: Number(a.is_featured ?? 0),
        created_at: String(a.created_at ?? ''),
      }));
    }

    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM knowledge_articles ORDER BY is_featured DESC, rowid ASC')
        .all() as unknown as KnowledgeArticleRecord[];
    }

    return [...getJsonStore().knowledgeArticles].sort((a, b) => b.is_featured - a.is_featured);
  },

  async getKnowledgeArticleById(id: string): Promise<KnowledgeArticleRecord | undefined> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw new Error(`Lỗi đọc chi tiết bài viết Supabase: ${error.message}`);
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
    }

    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM knowledge_articles WHERE id = ?')
        .get(id) as unknown as KnowledgeArticleRecord | undefined;
    }

    return getJsonStore().knowledgeArticles.find((a) => a.id === id);
  },

  async createKnowledgeArticle(params: {
    title: string;
    excerpt: string;
    content: string;
    imageFile?: string;
  }): Promise<KnowledgeArticleRecord> {
    const id = slugifyVietnamese(params.title);
    const supabase = getSupabaseClient();
    if (supabase) {
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
      if (error) throw new Error(`Không thể đăng bài viết lên Supabase: ${error.message}`);
      return {
        id: String(data.id),
        title: String(data.title),
        excerpt: String(data.excerpt),
        content: String(data.content),
        image_file: String(data.image_file),
        is_featured: Number(data.is_featured ?? 0),
        created_at: String(data.created_at ?? ''),
      };
    }

    const db = getSqliteDb();
    if (db) {
      db.prepare(
        `INSERT INTO knowledge_articles (id, title, excerpt, content, image_file, is_featured)
         VALUES (?, ?, ?, ?, ?, 0)`
      ).run(
        id,
        params.title,
        params.excerpt,
        params.content,
        params.imageFile || 'imgRectangle222.png'
      );
      return (await this.getKnowledgeArticleById(id))!;
    }

    const store = getJsonStore();
    const record: KnowledgeArticleRecord = {
      id,
      title: params.title,
      excerpt: params.excerpt,
      content: params.content,
      image_file: params.imageFile || 'imgRectangle222.png',
      is_featured: 0,
      created_at: nowTimestamp(),
    };
    store.knowledgeArticles.push(record);
    saveJsonStore();
    return record;
  },
};
