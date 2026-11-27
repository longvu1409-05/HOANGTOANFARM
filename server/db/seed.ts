import type { SqliteDatabaseLike } from './database';
import { SEED_KNOWLEDGE_ARTICLES, SEED_PRODUCTS, SEED_REVIEWS } from './seedData';

/**
 * Nạp dữ liệu mẫu ban đầu vào SQLite (7 sản phẩm, 2 đánh giá, 3 bài viết kiến thức)
 */
export function seedDatabase(db: SqliteDatabaseLike): void {
  const upsertProduct = db.prepare(`
    INSERT INTO products (
      id, node_id, name, category, description,
      spec_1, spec_2, unit, price_vnd, price_label,
      image_file, crop_json, stock, is_featured, is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(id) DO NOTHING
  `);

  for (const p of SEED_PRODUCTS) {
    upsertProduct.run(
      p.id,
      p.node_id,
      p.name,
      p.category,
      p.description,
      p.spec_1,
      p.spec_2,
      p.unit,
      p.price_vnd,
      p.price_label,
      p.image_file,
      p.crop_json,
      p.stock,
      p.is_featured
    );
  }

  const reviewCount = db.prepare('SELECT COUNT(*) AS count FROM reviews').get() as {
    count: number;
  };
  if (reviewCount.count === 0) {
    const insertReview = db.prepare(
      'INSERT INTO reviews (author, quote, rating, avatar_file) VALUES (?, ?, ?, ?)'
    );
    for (const r of SEED_REVIEWS) {
      insertReview.run(r.author, r.quote, r.rating, r.avatar_file);
    }
  }

  const articleCount = db.prepare('SELECT COUNT(*) AS count FROM knowledge_articles').get() as {
    count: number;
  };
  if (articleCount.count === 0) {
    const insertArticle = db.prepare(`
      INSERT INTO knowledge_articles (id, title, excerpt, content, image_file, is_featured)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const a of SEED_KNOWLEDGE_ARTICLES) {
      insertArticle.run(a.id, a.title, a.excerpt, a.content, a.image_file, a.is_featured);
    }
  }
}
