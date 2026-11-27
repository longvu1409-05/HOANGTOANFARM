import { getSqliteDb } from '../db/database';
import { getJsonStore, nowTimestamp, saveJsonStore } from '../db/jsonStore';
import { SubscriberRecord } from '../types/backend.types';

/**
 * Truy vấn danh sách email đăng ký nhận tin (newsletter_subscribers)
 */
export const newsletterRepo = {
  findByEmail(email: string): SubscriberRecord | undefined {
    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM newsletter_subscribers WHERE LOWER(email) = LOWER(?)')
        .get(email) as unknown as SubscriberRecord | undefined;
    }

    const normalized = email.trim().toLowerCase();
    return getJsonStore().subscribers.find((s) => s.email.toLowerCase() === normalized);
  },

  create(email: string): SubscriberRecord {
    const normalized = email.trim().toLowerCase();
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

  findAll(): SubscriberRecord[] {
    const db = getSqliteDb();
    if (db) {
      return db
        .prepare('SELECT * FROM newsletter_subscribers ORDER BY id DESC')
        .all() as unknown as SubscriberRecord[];
    }

    return [...getJsonStore().subscribers];
  },
};
