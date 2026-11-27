import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { getSupabaseClient } from '../db/supabaseClient';
import { ContactRecord, ContactStatus } from '../types/backend.types';

interface InsertContactParams {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

function normalizeContact(r: Record<string, unknown>): ContactRecord {
  return {
    id: Number(r.id),
    full_name: String(r.full_name),
    phone: String(r.phone),
    email: String(r.email ?? ''),
    subject: String(r.subject ?? ''),
    message: String(r.message ?? ''),
    status: String(r.status ?? 'new') as ContactStatus,
    created_at: String(r.created_at ?? ''),
  };
}

/**
 * Truy vấn và cập nhật tin nhắn liên hệ từ khách hàng (bảng contacts)
 */
export const contactRepo = {
  async create(params: InsertContactParams): Promise<ContactRecord> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          full_name: params.fullName,
          phone: params.phone,
          email: params.email,
          subject: params.subject,
          message: params.message,
          status: 'new',
        })
        .select('*')
        .single();
      if (error) throw new Error(`Không thể gửi liên hệ lên Supabase: ${error.message}`);
      return normalizeContact(data as Record<string, unknown>);
    }

    const db = getSqliteDb();
    if (db) {
      const res = db
        .prepare(
          `INSERT INTO contacts (full_name, phone, email, subject, message)
           VALUES (?, ?, ?, ?, ?)`
        )
        .run(params.fullName, params.phone, params.email, params.subject, params.message);

      return db
        .prepare('SELECT * FROM contacts WHERE id = ?')
        .get(Number(res.lastInsertRowid)) as unknown as ContactRecord;
    }

    const store = getJsonStore();
    const record: ContactRecord = {
      id: ++store.counters.contactId,
      full_name: params.fullName,
      phone: params.phone,
      email: params.email,
      subject: params.subject,
      message: params.message,
      status: 'new',
      created_at: nowTimestamp(),
    };
    store.contacts.unshift(record);
    saveJsonStore();
    return record;
  },

  async findAll(): Promise<ContactRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw new Error(`Lỗi đọc liên hệ Supabase: ${error.message}`);
      return (data ?? []).map((r) => normalizeContact(r as Record<string, unknown>));
    }

    const db = getSqliteDb();
    if (db) {
      return db.prepare('SELECT * FROM contacts ORDER BY id DESC').all() as unknown as ContactRecord[];
    }

    return [...getJsonStore().contacts];
  },

  async updateStatus(id: number, status: ContactStatus): Promise<ContactRecord | undefined> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('contacts')
        .update({ status })
        .eq('id', id)
        .select('*')
        .maybeSingle();
      if (error) throw new Error(`Không thể cập nhật trạng thái liên hệ: ${error.message}`);
      return data ? normalizeContact(data as Record<string, unknown>) : undefined;
    }

    const db = getSqliteDb();
    if (db) {
      db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, id);
      return db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) as unknown as
        | ContactRecord
        | undefined;
    }

    const store = getJsonStore();
    const item = store.contacts.find((c) => c.id === id);
    if (!item) return undefined;
    item.status = status;
    saveJsonStore();
    return item;
  },
};
