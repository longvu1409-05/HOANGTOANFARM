import { getDatabase } from '../db/database.js';
import { CreateProductInput, ProductRecord } from '../types/backend.types.js';
import { formatVnd, slugifyVietnamese } from '../utils/formatters.js';

interface ProductFilters {
  q?: string;
  category?: string;
  featuredOnly?: boolean;
  includeInactive?: boolean;
}

/**
 * Truy vấn và thao tác CRUD trên bảng products
 */
export const productRepo = {
  findAll(filters?: ProductFilters): ProductRecord[] {
    const db = getDatabase();
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (!filters?.includeInactive) {
      conditions.push('is_active = 1');
    }

    if (filters?.featuredOnly) {
      conditions.push('is_featured = 1');
    }

    if (filters?.category && filters.category !== 'Tất cả') {
      conditions.push('category = ?');
      params.push(filters.category);
    }

    const keyword = filters?.q?.trim();
    if (keyword) {
      const like = `%${keyword}%`;
      conditions.push('(name LIKE ? OR description LIKE ? OR spec_1 LIKE ? OR spec_2 LIKE ? OR unit LIKE ?)');
      params.push(like, like, like, like, like);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    return db
      .prepare(`SELECT * FROM products ${whereClause} ORDER BY is_featured DESC, rowid ASC`)
      .all(...params) as unknown as ProductRecord[];
  },

  findById(id: string): ProductRecord | undefined {
    const db = getDatabase();
    return db
      .prepare('SELECT * FROM products WHERE id = ? AND is_active = 1')
      .get(id) as unknown as ProductRecord | undefined;
  },

  create(input: CreateProductInput): ProductRecord {
    const db = getDatabase();
    const id = input.id || slugifyVietnamese(input.name);
    const priceLabel = formatVnd(input.priceVnd);

    db.prepare(
      `INSERT INTO products (
        id, node_id, name, category, description,
        spec_1, spec_2, unit, price_vnd, price_label,
        image_file, crop_json, stock, is_featured, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, 1)`
    ).run(
      id,
      `custom:${id}`,
      input.name,
      input.category,
      input.description,
      input.spec1,
      input.spec2,
      input.unit,
      input.priceVnd,
      priceLabel,
      input.imageFile,
      input.stock,
      input.isFeatured ? 1 : 0
    );

    return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as unknown as ProductRecord;
  },

  update(id: string, input: CreateProductInput): ProductRecord | undefined {
    const db = getDatabase();
    const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existing) return undefined;

    const priceLabel = formatVnd(input.priceVnd);
    db.prepare(
      `UPDATE products
       SET name = ?, category = ?, description = ?,
           spec_1 = ?, spec_2 = ?, unit = ?,
           price_vnd = ?, price_label = ?, image_file = ?,
           stock = ?, is_featured = ?, is_active = 1
       WHERE id = ?`
    ).run(
      input.name,
      input.category,
      input.description,
      input.spec1,
      input.spec2,
      input.unit,
      input.priceVnd,
      priceLabel,
      input.imageFile,
      input.stock,
      input.isFeatured ? 1 : 0,
      id
    );

    return db.prepare('SELECT * FROM products WHERE id = ?').get(id) as unknown as ProductRecord;
  },

  /**
   * Nếu sản phẩm đã có đơn hàng tham chiếu thì ẩn (soft delete), chưa có thì xóa hẳn.
   */
  remove(id: string): { deleted: boolean; softDeleted: boolean } {
    const db = getDatabase();
    const refOrder = db
      .prepare('SELECT COUNT(*) AS count FROM orders WHERE product_id = ?')
      .get(id) as { count: number };
    const refItems = db
      .prepare('SELECT COUNT(*) AS count FROM order_items WHERE product_id = ?')
      .get(id) as { count: number };

    if (refOrder.count > 0 || refItems.count > 0) {
      const res = db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(id);
      return { deleted: Number(res.changes) > 0, softDeleted: true };
    }

    const res = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return { deleted: Number(res.changes) > 0, softDeleted: false };
  },
};
