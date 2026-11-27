import { requireSupabaseClient } from '../db/supabaseClient.js';
import { CreateProductInput, ProductRecord } from '../types/backend.types.js';
import { formatVnd, slugifyVietnamese } from '../utils/formatters.js';

interface ProductFilters {
  q?: string;
  category?: string;
  featuredOnly?: boolean;
  includeInactive?: boolean;
}

function toRecord(row: Record<string, unknown>): ProductRecord {
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

export const productRepo = {
  async findAll(filters?: ProductFilters): Promise<ProductRecord[]> {
    const supabase = requireSupabaseClient();
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
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => toRecord(r as Record<string, unknown>));
  },

  async findById(id: string): Promise<ProductRecord | undefined> {
    const supabase = requireSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('is_active', 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toRecord(data as Record<string, unknown>) : undefined;
  },

  async create(input: CreateProductInput): Promise<ProductRecord> {
    const supabase = requireSupabaseClient();
    const id = input.id || slugifyVietnamese(input.name);
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
        price_label: formatVnd(input.priceVnd),
        image_file: input.imageFile,
        crop_json: null,
        stock: input.stock,
        is_featured: input.isFeatured ? 1 : 0,
        is_active: 1,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return toRecord(data as Record<string, unknown>);
  },

  async update(id: string, input: CreateProductInput): Promise<ProductRecord | undefined> {
    const supabase = requireSupabaseClient();
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
        price_label: formatVnd(input.priceVnd),
        image_file: input.imageFile,
        stock: input.stock,
        is_featured: input.isFeatured ? 1 : 0,
        is_active: 1,
      })
      .eq('id', id)
      .select('*')
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toRecord(data as Record<string, unknown>) : undefined;
  },

  async remove(id: string): Promise<{ deleted: boolean; softDeleted: boolean }> {
    const supabase = requireSupabaseClient();
    const [{ count: refOrders }, { count: refItems }] = await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('product_id', id),
      supabase.from('order_items').select('*', { count: 'exact', head: true }).eq('product_id', id),
    ]);

    if ((refOrders ?? 0) > 0 || (refItems ?? 0) > 0) {
      const { data, error } = await supabase
        .from('products')
        .update({ is_active: 0 })
        .eq('id', id)
        .select('id');
      if (error) throw new Error(error.message);
      return { deleted: (data?.length ?? 0) > 0, softDeleted: true };
    }

    const { data, error } = await supabase.from('products').delete().eq('id', id).select('id');
    if (error) throw new Error(error.message);
    return { deleted: (data?.length ?? 0) > 0, softDeleted: false };
  },
};
