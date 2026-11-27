import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '../config/env';

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

/**
 * Khởi tạo kết nối tới Supabase Postgres khi có SUPABASE_URL và SUPABASE_SECRET_KEY.
 * - Trên máy chủ (Express / Vercel Function), tắt persistSession & autoRefreshToken để tối ưu bộ nhớ.
 * - Nếu chưa cấu hình .env, hàm trả về null để hệ thống dùng SQLite local bình thường.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) {
    cachedClient = null;
    cachedSignature = '';
    return null;
  }

  const signature = `${url}::${key}`;
  if (cachedClient && cachedSignature === signature) {
    return cachedClient;
  }

  cachedClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  cachedSignature = signature;
  return cachedClient;
}

/**
 * Kiểm tra loại khóa Supabase đang dùng (giúp chẩn đoán nhanh qua /api/health)
 */
export function getSupabaseKeyType(): 'secret' | 'publishable_warning' | 'unconfigured' {
  const { url, key } = getSupabaseEnv();
  if (!url || !key) return 'unconfigured';
  if (key.startsWith('sb_publishable_')) return 'publishable_warning';
  return 'secret';
}
