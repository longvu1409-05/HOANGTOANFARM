import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { getSupabaseClient } from '../db/supabaseClient';
import { CreateProductInput, ProductRecord } from '../types/backend.types';
import { formatVnd, slugifyVietnamese } from '../utils/formatters';

interface ProductFilters {
  q?: string;
  category?: string;
  featuredOnly?: boolean;
  includeInactive?: boolean;
}

function normalizeProductRow(row: Record<string, unknown>): ProductRecord {
  return {
    id: String(row.id),
    node_id: String(row.node_id ?? ''),
    name: String(row.name),
    category: String(row.category ?? 'Trái cây tươi'),
    description: String(row.description ?? ''),
    spec_1: String(row.spec_1),
    spec_2: String(row.spec_2),
    unit: String(row.unit),
    price_vnd: Number(row.price_vnd),
    price_label: String(row.price_label),
    image_file: String(row.image_file),
    crop_json: row.crop_json ? String(row.crop_json) : null,
    stock: Number(row.stock ?? 0),
    is_featured: Number(row.is_featured ?? 0),
    is_active: Number(row.is_active ?? 1),
    created_at: String(row.created_at ?? ''),
  };
}

/**
 * Truy vấn & CRUD bảng products (Ưu tiên Supabase -> SQLite -> JSON fallback)
 */
export const productRepo = {
  async findAll(filters?: ProductFilters): Promise<ProductRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      let query = supabase
        .from('products')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: true });

      if (!filters?.includeInactive) query = query.eq('is_active', 1);
      if (filters?.featuredOnly) query = query.eq('is_featured', 1);
      if (filters?.category && filters.category !== 'Tất cả') {
        query = query.eq('category', filters.category);
      }

      const kw = filters?.q?.trim().replace(/[%_,()]/g, '');
      if (kw) {
        query = query.or(
          `name.ilike.%${kw}%,description.ilike.%${kw}%,spec_1.ilike.%${kw}%,spec_2.ilike.%${kw}%,unit.ilike.%${kw}%`
        );
      }

      const { data, error } = await query;
      if (error) throw new Error(`Lỗi truy vấn sản phẩm Supabase: ${error.message}`);
      return (data ?? []).map((r) => normalizeProductRow(r as Record<string, unknown>));
    }

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

  async findById(id: string): Promise<ProductRecord | undefined> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', 1)
        .maybeSingle();
      if (error) throw new Error(`Lỗi đọc sản phẩm Supabase: ${error.message}`);
      return data ? normalizeProductRow(data as Record<string, unknown>) : undefined;
    }

    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM products WHERE id = ? AND is_active = 1')
        .get(id) as unknown as ProductRecord | undefined;
    }

    return getJsonStore().products.find((p) => p.id === id && p.is_active === 1);
  },

  async create(input: CreateProductInput): Promise<ProductRecord> {
    const id = input.id || slugifyVietnamese(input.name);
    const priceLabel = formatVnd(input.priceVnd);

    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert({
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
        })
        .select('*')
        .single();
      if (error) throw new Error(`Không thể tạo sản phẩm trên Supabase: ${error.message}`);
      return normalizeProductRow(data as Record<string, unknown>);
    }

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

  async update(id: string, input: CreateProductInput): Promise<ProductRecord | undefined> {
    const priceLabel = formatVnd(input.priceVnd);

    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: input.name,
          category: input.category,
          description: input.description,
          spec_1: input.spec1,
          spec_2: input.spec2,
          unit: input.unit,
          price_vnd: input.priceVnd,
          price_label: priceLabel,
          image_file: input.imageFile,
          stock: input.stock,
          is_featured: input.isFeatured ? 1 : 0,
          is_active: 1,
        })
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) throw new Error(`Không thể cập nhật sản phẩm trên Supabase: ${error.message}`);
      return data ? normalizeProductRow(data as Record<string, unknown>) : undefined;
    }

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

  async remove(id: string): Promise<{ deleted: boolean; softDeleted: boolean }> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const [{ count: refOrders }, { count: refItems }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('product_id', id),
        supabase
          .from('order_items')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', id),
      ]);

      if ((refOrders ?? 0) > 0 || ((refItems ?? 0) > 0)) {
        const { data, error } = await supabase
          .from('products')
          .update({ is_active: 0 })
          .eq('id', id)
          .select('id');
        if (error) throw new Error(`Lỗi ẩn sản phẩm trên Supabase: ${error.message}`);
        return { deleted: (data?.length ?? 0) > 0, softDeleted: true };
      }

      const { data, error } = await supabase.from('products').delete().eq('id', id).select('id');
      if (error) throw new Error(`Lỗi xóa sản phẩm trên Supabase: ${error.message}`);
      return { deleted: (data?.length ?? 0) > 0, softDeleted: false };
    }

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
