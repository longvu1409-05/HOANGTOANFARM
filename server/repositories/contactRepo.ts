import { getDatabase } from '../db/database.js';
import { ContactRecord, ContactStatus } from '../types/backend.types.js';

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
    const db = getDatabase();
    const res = db
      .prepare(
        `INSERT INTO contacts (full_name, phone, email, subject, message)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(params.fullName, params.phone, params.email, params.subject, params.message);

    return db
      .prepare('SELECT * FROM contacts WHERE id = ?')
      .get(Number(res.lastInsertRowid)) as unknown as ContactRecord;
  },

  findAll(): ContactRecord[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM contacts ORDER BY id DESC').all() as unknown as ContactRecord[];
  },

  updateStatus(id: number, status: ContactStatus): ContactRecord | undefined {
    const db = getDatabase();
    db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, id);
    return db.prepare('SELECT * FROM contacts WHERE id = ?').get(id) as unknown as
      | ContactRecord
      | undefined;
  },
};
