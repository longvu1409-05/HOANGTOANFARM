import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from '../config/env.js';

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

/**
 * Lấy đối tượng kết nối Supabase Postgres (dùng cho toàn bộ Backend)
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

export function requireSupabaseClient(): SupabaseClient {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      'Chưa cấu hình SUPABASE_URL và SUPABASE_SECRET_KEY trong biến môi trường (.env hoặc Vercel).'
    );
  }
  return client;
}
