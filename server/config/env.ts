import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

function loadLocalEnvFiles(): Record<string, string> {
  const parsed: Record<string, string> = {};
  for (const fileName of ['.env', '.env.local']) {
    const fullPath = path.join(ROOT_DIR, fileName);
    if (!fs.existsSync(fullPath)) continue;
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const rawLine of content.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eqIdx = line.indexOf('=');
        if (eqIdx <= 0) continue;
        const key = line.slice(0, eqIdx).trim();
        let value = line.slice(eqIdx + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        parsed[key] = value;
      }
    } catch {
      // Bỏ qua nếu không đọc được file .env
    }
  }
  return parsed;
}

const initialLocalEnv = loadLocalEnvFiles();
for (const [k, v] of Object.entries(initialLocalEnv)) {
  if (!process.env[k]) process.env[k] = v;
}

const isVercel = Boolean(process.env.VERCEL);

export function getSupabaseEnv() {
  const fileEnv = isVercel ? {} : loadLocalEnvFiles();
  const pick = (key: string) => (process.env[key] || fileEnv[key] || '').trim();

  const url =
    pick('SUPABASE_URL') || pick('NEXT_PUBLIC_SUPABASE_URL') || pick('VITE_SUPABASE_URL');
  const key =
    pick('SUPABASE_SECRET_KEY') ||
    pick('SUPABASE_SERVICE_ROLE_KEY') ||
    pick('SUPABASE_KEY') ||
    pick('SUPABASE_ANON_KEY') ||
    pick('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  return { url, key };
}

/**
 * Đọc tài khoản Quản trị viên (có thể đổi bất cứ lúc nào qua ADMIN_USERNAME / ADMIN_PASSWORD trong .env hoặc Vercel)
 */
export function getAdminCredentials() {
  const fileEnv = isVercel ? {} : loadLocalEnvFiles();
  const pick = (key: string) => (process.env[key] || fileEnv[key] || '').trim();
  const { key: supaKey } = getSupabaseEnv();

  return {
    username: pick('ADMIN_USERNAME') || 'admin',
    password: pick('ADMIN_PASSWORD') || 'hoangtoan2026',
    signingSecret: pick('ADMIN_JWT_SECRET') || `${supaKey || 'htf-fallback'}::htf-admin-v1`,
  };
}

export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  IS_VERCEL: isVercel,
  DIST_DIR: path.resolve(ROOT_DIR, 'dist'),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
} as const;
