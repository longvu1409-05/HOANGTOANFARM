import { getDatabase } from '../db/database.js';
import { KnowledgeArticleRecord, ReviewRecord } from '../types/backend.types.js';
import { slugifyVietnamese } from '../utils/formatters.js';

/**
 * Truy vấn bài viết kiến thức & đánh giá khách hàng
 */
export const contentRepo = {
  getAllReviews(): ReviewRecord[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM reviews ORDER BY id DESC').all() as unknown as ReviewRecord[];
  },

  createReview(author: string, quote: string, rating = 5): ReviewRecord {
    const db = getDatabase();
    const result = db
      .prepare('INSERT INTO reviews (author, quote, rating) VALUES (?, ?, ?)')
      .run(author, quote, rating);
    return db
      .prepare('SELECT * FROM reviews WHERE id = ?')
      .get(Number(result.lastInsertRowid)) as unknown as ReviewRecord;
  },

  getAllKnowledgeArticles(): KnowledgeArticleRecord[] {
    const db = getDatabase();
    return db
      .prepare('SELECT * FROM knowledge_articles ORDER BY is_featured DESC, rowid ASC')
      .all() as unknown as KnowledgeArticleRecord[];
  },

  getKnowledgeArticleById(id: string): KnowledgeArticleRecord | undefined {
    const db = getDatabase();
    return db
      .prepare('SELECT * FROM knowledge_articles WHERE id = ?')
      .get(id) as unknown as KnowledgeArticleRecord | undefined;
  },

  createKnowledgeArticle(params: {
    title: string;
    excerpt: string;
    content: string;
    imageFile?: string;
  }): KnowledgeArticleRecord {
    const db = getDatabase();
    const id = slugifyVietnamese(params.title);
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
  },
};
