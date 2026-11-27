import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { ContactRecord, ContactStatus } from '../types/backend.types';

interface InsertContactParams {
  fullName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Truy vấn và cập nhật tin nhắn liên hệ từ khách hàng (bảng contacts)
 */
export const contactRepo = {
  create(params: InsertContactParams): ContactRecord {
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

  findAll(): ContactRecord[] {
    const db = getSqliteDb();
    if (db) {
      return db.prepare('SELECT * FROM contacts ORDER BY id DESC').all() as unknown as ContactRecord[];
    }

    return [...getJsonStore().contacts];
  },

  updateStatus(id: number, status: ContactStatus): ContactRecord | undefined {
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
