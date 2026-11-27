import { getDatabase } from '../db/database.js';
import { SubscriberRecord } from '../types/backend.types.js';

/**
 * Truy vấn danh sách email đăng ký nhận tin (newsletter_subscribers)
 */
export const newsletterRepo = {
  findByEmail(email: string): SubscriberRecord | undefined {
    const db = getDatabase();
    return db
      .prepare('SELECT * FROM newsletter_subscribers WHERE LOWER(email) = LOWER(?)')
      .get(email) as unknown as SubscriberRecord | undefined;
  },

  create(email: string): SubscriberRecord {
    const db = getDatabase();
    const result = db
      .prepare('INSERT INTO newsletter_subscribers (email) VALUES (?)')
      .run(email.toLowerCase());
    return db
      .prepare('SELECT * FROM newsletter_subscribers WHERE id = ?')
      .get(Number(result.lastInsertRowid)) as unknown as SubscriberRecord;
  },

  findAll(): SubscriberRecord[] {
    const db = getDatabase();
    return db
      .prepare('SELECT * FROM newsletter_subscribers ORDER BY id DESC')
      .all() as unknown as SubscriberRecord[];
  },
};
