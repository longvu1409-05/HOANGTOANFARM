import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { ENV } from '../config/env.js';

let dbInstance: DatabaseSync | null = null;

/**
 * Lấy kết nối SQLite duy nhất (Singleton) và tự động tạo bảng nếu chưa tồn tại.
 */
export function getDatabase(): DatabaseSync {
  if (dbInstance) {
    return dbInstance;
  }

  fs.mkdirSync(path.dirname(ENV.DB_PATH), { recursive: true });
  const db = new DatabaseSync(ENV.DB_PATH);

  // Bật chế độ WAL để đọc/ghi đồng thời ổn định hơn
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  createSchema(db);
  dbInstance = db;
  return dbInstance;
}

/**
 * Khởi tạo cấu trúc các bảng trong cơ sở dữ liệu SQLite
 */
function createSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      node_id TEXT NOT NULL,
      name TEXT NOT NULL,
      spec_1 TEXT NOT NULL,
      spec_2 TEXT NOT NULL,
      unit TEXT NOT NULL,
      price_vnd INTEGER NOT NULL,
      price_label TEXT NOT NULL,
      image_file TEXT NOT NULL,
      crop_json TEXT,
      stock INTEGER NOT NULL DEFAULT 100,
      is_featured INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_code TEXT NOT NULL UNIQUE,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      unit_price_vnd INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      total_price_vnd INTEGER NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      note TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT NOT NULL,
      quote TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      avatar_file TEXT NOT NULL DEFAULT 'imgEllipse47.png',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );

    CREATE TABLE IF NOT EXISTS knowledge_articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image_file TEXT NOT NULL,
      is_featured INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
}
