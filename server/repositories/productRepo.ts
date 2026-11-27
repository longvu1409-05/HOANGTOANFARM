import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { CreateProductInput, ProductRecord } from '../types/backend.types';
import { formatVnd, slugifyVietnamese } from '../utils/formatters';

interface ProductFilters {
  q?: string;
  category?: string;
  featuredOnly?: boolean;
  includeInactive?: boolean;
}

/**
 * Truy vấn và thao tác CRUD trên bảng products (hỗ trợ SQLite + JSON fallback)
 */
export const productRepo = {
  findAll(filters?: ProductFilters): ProductRecord[] {
    const db = getSqliteDb();
    if (db) {
      const conditions: string[] = [];
      const params: (string | number)[] = [];

      if (!filters?.includeInactive) conditions.push('is_active = 1');
      if (filters?.featuredOnly) conditions.push('is_featured = 1');
      if (filters?.category && filters.category !== 'Tất cả') {
        conditions.push('category = ?');
        params.push(filters.category);
      }

      const keyword = filters?.q?.trim();
      if (keyword) {
        const like = `%${keyword}%`;
        conditions.push(
          '(name LIKE ? OR description LIKE ? OR spec_1 LIKE ? OR spec_2 LIKE ? OR unit LIKE ?)'
        );
        params.push(like, like, like, like, like);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      return db
        .prepare(`SELECT * FROM products ${whereClause} ORDER BY is_featured DESC, rowid ASC`)
        .all(...params) as unknown as ProductRecord[];
    }

    const store = getJsonStore();
    const keyword = filters?.q?.trim().toLowerCase();
    return store.products
      .filter((p) => {
        if (!filters?.includeInactive && p.is_active !== 1) return false;
        if (filters?.featuredOnly && p.is_featured !== 1) return false;
        if (filters?.category && filters.category !== 'Tất cả' && p.category !== filters.category) {
          return false;
        }
        if (keyword) {
          const hay = `${p.name} ${p.description} ${p.spec_1} ${p.spec_2} ${p.unit}`.toLowerCase();
          if (!hay.includes(keyword)) return false;
        }
        return true;
      })
      .sort((a, b) => b.is_featured - a.is_featured);
  },

  findById(id: string): ProductRecord | undefined {
    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM products WHERE id = ? AND is_active = 1')
        .get(id) as unknown as ProductRecord | undefined;
    }

    return getJsonStore().products.find((p) => p.id === id && p.is_active === 1);
  },

  create(input: CreateProductInput): ProductRecord {
    const id = input.id || slugifyVietnamese(input.name);
    const priceLabel = formatVnd(input.priceVnd);
    const db = getSqliteDb();

    if (db) {
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
    }

    const store = getJsonStore();
    const record: ProductRecord = {
      id,
      node_id: `custom:${id}`,
      name: input.name,
      category: input.category,
      description: input.description,
      spec_1: input.spec1,
      spec_2: input.spec2,
      unit: input.unit,
      price_vnd: input.priceVnd,
      price_label: priceLabel,
      image_file: input.imageFile,
      crop_json: null,
      stock: input.stock,
      is_featured: input.isFeatured ? 1 : 0,
      is_active: 1,
      created_at: nowTimestamp(),
    };
    store.products.push(record);
    saveJsonStore();
    return record;
  },

  update(id: string, input: CreateProductInput): ProductRecord | undefined {
    const priceLabel = formatVnd(input.priceVnd);
    const db = getSqliteDb();

    if (db) {
      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
      if (!existing) return undefined;

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
    }

    const store = getJsonStore();
    const target = store.products.find((p) => p.id === id);
    if (!target) return undefined;

    target.name = input.name;
    target.category = input.category;
    target.description = input.description;
    target.spec_1 = input.spec1;
    target.spec_2 = input.spec2;
    target.unit = input.unit;
    target.price_vnd = input.priceVnd;
    target.price_label = priceLabel;
    target.image_file = input.imageFile;
    target.stock = input.stock;
    target.is_featured = input.isFeatured ? 1 : 0;
    target.is_active = 1;
    saveJsonStore();
    return target;
  },

  remove(id: string): { deleted: boolean; softDeleted: boolean } {
    const db = getSqliteDb();
    if (db) {
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
    }

    const store = getJsonStore();
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) return { deleted: false, softDeleted: false };

    const hasOrderRef = store.orders.some(
      (o) => o.product_id === id || o.items?.some((it) => it.product_id === id)
    );
    if (hasOrderRef) {
      store.products[idx].is_active = 0;
      saveJsonStore();
      return { deleted: true, softDeleted: true };
    }

    store.products.splice(idx, 1);
    saveJsonStore();
    return { deleted: true, softDeleted: false };
  },
};
