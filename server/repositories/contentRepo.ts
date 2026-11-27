import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { KnowledgeArticleRecord, ReviewRecord } from '../types/backend.types';
import { slugifyVietnamese } from '../utils/formatters';

/**
 * Truy vấn bài viết kiến thức & đánh giá khách hàng
 */
export const contentRepo = {
  getAllReviews(): ReviewRecord[] {
    const db = getSqliteDb();
    if (db) {
      return db.prepare('SELECT * FROM reviews ORDER BY id DESC').all() as unknown as ReviewRecord[];
    }

    return [...getJsonStore().reviews].sort((a, b) => b.id - a.id);
  },

  createReview(author: string, quote: string, rating = 5): ReviewRecord {
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

  getAllKnowledgeArticles(): KnowledgeArticleRecord[] {
    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM knowledge_articles ORDER BY is_featured DESC, rowid ASC')
        .all() as unknown as KnowledgeArticleRecord[];
    }

    return [...getJsonStore().knowledgeArticles].sort((a, b) => b.is_featured - a.is_featured);
  },

  getKnowledgeArticleById(id: string): KnowledgeArticleRecord | undefined {
    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM knowledge_articles WHERE id = ?')
        .get(id) as unknown as KnowledgeArticleRecord | undefined;
    }

    return getJsonStore().knowledgeArticles.find((a) => a.id === id);
  },

  createKnowledgeArticle(params: {
    title: string;
    excerpt: string;
    content: string;
    imageFile?: string;
  }): KnowledgeArticleRecord {
    const id = slugifyVietnamese(params.title);
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
      return this.getKnowledgeArticleById(id)!;
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
