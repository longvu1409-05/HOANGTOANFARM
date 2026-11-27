import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { getSupabaseClient } from '../db/supabaseClient';
import { SubscriberRecord } from '../types/backend.types';

/**
 * Truy vấn danh sách email đăng ký nhận tin (newsletter_subscribers)
 */
export const newsletterRepo = {
  async findByEmail(email: string): Promise<SubscriberRecord | undefined> {
    const normalized = email.trim().toLowerCase();
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .ilike('email', normalized)
        .maybeSingle();
      if (error) throw new Error(`Lỗi kiểm tra email Supabase: ${error.message}`);
      return data
        ? { id: Number(data.id), email: String(data.email), created_at: String(data.created_at) }
        : undefined;
    }

    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM newsletter_subscribers WHERE LOWER(email) = LOWER(?)')
        .get(email) as unknown as SubscriberRecord | undefined;
    }

    return getJsonStore().subscribers.find((s) => s.email.toLowerCase() === normalized);
  },

  async create(email: string): Promise<SubscriberRecord> {
    const normalized = email.trim().toLowerCase();
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email: normalized })
        .select('*')
        .single();
      if (error) throw new Error(`Không thể lưu email lên Supabase: ${error.message}`);
      return {
        id: Number(data.id),
        email: String(data.email),
        created_at: String(data.created_at),
      };
    }

    const db = getSqliteDb();
    if (db) {
      const result = db
        .prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)')
        .run(normalized);
      return db
        .prepare('SELECT * FROM newsletter_subscribers WHERE id = ?')
        .get(Number(result.lastInsertRowid)) as unknown as SubscriberRecord;
    }

    const store = getJsonStore();
    const record: SubscriberRecord = {
      id: ++store.counters.subscriberId,
      email: normalized,
      created_at: nowTimestamp(),
    };
    store.subscribers.unshift(record);
    saveJsonStore();
    return record;
  },

  async findAll(): Promise<SubscriberRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw new Error(`Lỗi đọc danh sách nhận tin Supabase: ${error.message}`);
      return (data ?? []).map((r) => ({
        id: Number(r.id),
        email: String(r.email),
        created_at: String(r.created_at),
      }));
    }

    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM newsletter_subscribers ORDER BY id DESC')
        .all() as unknown as SubscriberRecord[];
    }

    return [...getJsonStore().subscribers];
  },
};
