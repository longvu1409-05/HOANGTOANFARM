import fs from 'node:fs';
import path from 'node:path';
import { ENV } from '../config/env';
import {
  ContactRecord,
  KnowledgeArticleRecord,
  OrderRecord,
  ProductRecord,
  ReviewRecord,
  SubscriberRecord,
} from '../types/backend.types';
import { SEED_KNOWLEDGE_ARTICLES, SEED_PRODUCTS, SEED_REVIEWS } from './seedData';

export interface JsonStoreData {
  products: ProductRecord[];
  orders: OrderRecord[];
  subscribers: SubscriberRecord[];
  reviews: ReviewRecord[];
  knowledgeArticles: KnowledgeArticleRecord[];
  contacts: ContactRecord[];
  counters: {
    orderId: number;
    orderItemId: number;
    subscriberId: number;
    reviewId: number;
    contactId: number;
  };
}

let memoryCache: JsonStoreData | null = null;

export function nowTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function createInitialStore(): JsonStoreData {
  return {
    products: SEED_PRODUCTS.map((p) => ({ ...p })),
    orders: [],
    subscribers: [],
    reviews: SEED_REVIEWS.map((r) => ({ ...r })),
    knowledgeArticles: SEED_KNOWLEDGE_ARTICLES.map((a) => ({ ...a })),
    contacts: [],
    counters: {
      orderId: 0,
      orderItemId: 0,
      subscriberId: 0,
      reviewId: SEED_REVIEWS.length,
      contactId: 0,
    },
  };
}

/**
 * Đọc kho JSON dự phòng (dùng khi môi trường Serverless chạy Node < 22.5 không có node:sqlite)
 */
export function getJsonStore(): JsonStoreData {
  if (memoryCache) return memoryCache;

  try {
    if (fs.existsSync(ENV.JSON_DB_PATH)) {
      const raw = fs.readFileSync(ENV.JSON_DB_PATH, 'utf-8');
      memoryCache = JSON.parse(raw) as JsonStoreData;
      return memoryCache;
    }
  } catch {
    // Khởi tạo mới nếu tệp chưa có hoặc lỗi đọc
  }

  memoryCache = createInitialStore();
  saveJsonStore();
  return memoryCache;
}

export function saveJsonStore(): void {
  if (!memoryCache) return;
  try {
    fs.mkdirSync(path.dirname(ENV.JSON_DB_PATH), { recursive: true });
    fs.writeFileSync(ENV.JSON_DB_PATH, JSON.stringify(memoryCache, null, 2), 'utf-8');
  } catch {
    // Trên vùng nhớ chỉ đọc vẫn giữ nguyên dữ liệu trong memoryCache của warm instance
  }
}
