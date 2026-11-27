import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { ENV } from '../config/env';
import { seedDatabase } from './seed';

export interface SqliteStatementLike {
  run: (...params: unknown[]) => { changes: number | bigint; lastInsertRowid: number | bigint };
  get: (...params: unknown[]) => unknown;
  all: (...params: unknown[]) => unknown[];
}

export interface SqliteDatabaseLike {
  exec: (sql: string) => void;
  prepare: (sql: string) => SqliteStatementLike;
}

const requireModule = createRequire(import.meta.url);

let dbInstance: SqliteDatabaseLike | null = null;
let sqliteChecked = false;
let sqliteUnavailable = false;

/**
 * Lấy kết nối SQLite duy nhất (tự động nạp dữ liệu gốc khi khởi tạo).
 * Nếu môi trường Node trên host không có module 'node:sqlite' (ví dụ Node 18/20),
 * hàm trả về null một cách an toàn để hệ thống tự chuyển sang jsonStore.
 */
export function getSqliteDb(): SqliteDatabaseLike | null {
  if (dbInstance) return dbInstance;
  if (sqliteChecked && sqliteUnavailable) return null;

  sqliteChecked = true;
  try {
    const sqliteMod = requireModule('node:sqlite') as {
      DatabaseSync: new (dbPath: string) => SqliteDatabaseLike;
    };

    fs.mkdirSync(path.dirname(ENV.DB_PATH), { recursive: true });
    const db = new sqliteMod.DatabaseSync(ENV.DB_PATH);

    db.exec(ENV.IS_VERCEL ? 'PRAGMA journal_mode = DELETE;' : 'PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA foreign_keys = ON;');

    createSchema(db);
    migrateSchema(db);
    seedDatabase(db);

    dbInstance = db;
    return dbInstance;
  } catch (err) {
    sqliteUnavailable = true;
    console.warn('[DB] node:sqlite không khả dụng, sử dụng kho JSON dự phòng:', err);
    return null;
  }
}

/** Giữ tương thích với server/index.ts */
export function getDatabase(): SqliteDatabaseLike | null {
  return getSqliteDb();
}

function createSchema(db: SqliteDatabaseLike): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      node_id TEXT NOT NULL DEFAULT '',
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Trái cây tươi',
      description TEXT NOT NULL DEFAULT '',
      spec_1 TEXT NOT NULL,
      spec_2 TEXT NOT NULL,
      unit TEXT NOT NULL,
      price_vnd INTEGER NOT NULL,
      price_label TEXT NOT NULL,
      image_file TEXT NOT NULL,
      crop_json TEXT,
      stock INTEGER NOT NULL DEFAULT 100,
      is_featured INTEGER NOT NULL DEFAULT 1,
      is_active INTEGER NOT NULL DEFAULT 1,
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
      address TEXT NOT NULL DEFAULT '',
      note TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      unit_price_vnd INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      subtotal_vnd INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
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

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      subject TEXT NOT NULL DEFAULT 'Tư vấn đặt hàng',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
}

function migrateSchema(db: SqliteDatabaseLike): void {
  const ensureColumn = (table: string, col: string, definition: string) => {
    const cols = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
    if (!cols.some((c) => c.name === col)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${definition}`);
    }
  };

  ensureColumn('products', 'category', "TEXT NOT NULL DEFAULT 'Trái cây tươi'");
  ensureColumn('products', 'description', "TEXT NOT NULL DEFAULT ''");
  ensureColumn('products', 'is_active', 'INTEGER NOT NULL DEFAULT 1');
  ensureColumn('orders', 'address', "TEXT NOT NULL DEFAULT ''");
}
