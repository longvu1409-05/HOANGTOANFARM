import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = Boolean(process.env.VERCEL);

/**
 * Cấu hình môi trường tập trung cho Backend Hoàng Toàn Farm
 * - Trên Vercel Serverless: sử dụng /tmp (vùng nhớ được phép ghi)
 * - Trên máy local: lưu bền vững trong server/data/
 */
export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  IS_VERCEL: isVercel,
  DB_PATH: isVercel
    ? '/tmp/hoangtoanfarm.sqlite'
    : path.resolve(__dirname, '../data/hoangtoanfarm.sqlite'),
  JSON_DB_PATH: isVercel
    ? '/tmp/hoangtoanfarm-store.json'
    : path.resolve(__dirname, '../data/hoangtoanfarm-store.json'),
  DIST_DIR: path.resolve(__dirname, '../../dist'),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
} as const;
