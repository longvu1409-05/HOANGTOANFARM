import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cấu hình môi trường tập trung cho Backend Hoàng Toàn Farm
 */
export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DB_PATH: path.resolve(__dirname, '../data/hoangtoanfarm.sqlite'),
  DIST_DIR: path.resolve(__dirname, '../../dist'),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
} as const;
