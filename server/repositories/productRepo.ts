import { getDatabase } from '../db/database.js';
import { ProductRecord } from '../types/backend.types.js';

/**
 * Truy vấn dữ liệu bảng products trong SQLite
 */
export const productRepo = {
  findAll(searchQuery?: string): ProductRecord[] {
    const db = getDatabase();
    const keyword = searchQuery?.trim();

    if (keyword) {
      const like = `%${keyword}%`;
      return db
        .prepare(
          `SELECT * FROM products
           WHERE name LIKE ? OR spec_1 LIKE ? OR spec_2 LIKE ? OR unit LIKE ?
           ORDER BY rowid ASC`
        )
        .all(like, like, like, like) as unknown as ProductRecord[];
    }

    return db.prepare('SELECT * FROM products ORDER BY rowid ASC').all() as unknown as ProductRecord[];
  },

  findById(id: string): ProductRecord | undefined {
    const db = getDatabase();
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as unknown as
      | ProductRecord
      | undefined;
  },
};
