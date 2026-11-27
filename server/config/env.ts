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

function makeEnvPicker() {
  const fileEnv = isVercel ? {} : loadLocalEnvFiles();
  return (key: string) => (process.env[key] || fileEnv[key] || '').trim();
}

export function getSupabaseEnv() {
  const pick = makeEnvPicker();
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

export function getAdminCredentials() {
  const pick = makeEnvPicker();
  const { key: supaKey } = getSupabaseEnv();

  return {
    username: pick('ADMIN_USERNAME') || 'admin',
    password: pick('ADMIN_PASSWORD') || 'hoangtoan2026',
    signingSecret: pick('ADMIN_JWT_SECRET') || `${supaKey || 'htf-fallback'}::htf-admin-v1`,
  };
}

/**
 * Cấu hình gửi Email thông báo đơn hàng (ưu tiên Gmail SMTP App Password hoặc Resend API)
 */
export function getEmailEnv() {
  const pick = makeEnvPicker();
  const smtpUser = pick('SMTP_USER');
  // Tự động bỏ khoảng trắng nếu người dùng copy Mật khẩu ứng dụng 16 ký tự từ Google
  const smtpPass = pick('SMTP_PASS').replace(/\s+/g, '');
  const smtpHost = pick('SMTP_HOST') || 'smtp.gmail.com';
  const smtpPort = Number(pick('SMTP_PORT') || 465);
  const resendApiKey = pick('RESEND_API_KEY');
  const fromEmail =
    pick('EMAIL_FROM') ||
    (smtpUser ? `"Hoàng Toàn Farm" <${smtpUser}>` : 'Hoàng Toàn Farm <onboarding@resend.dev>');
  const siteUrl = (pick('PUBLIC_SITE_URL') || 'https://hoangtoanfarmweb.vercel.app').replace(
    /\/+$/,
    ''
  );

  return {
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
    resendApiKey,
    fromEmail,
    siteUrl,
  };
}

export const ENV = {
  PORT: Number(process.env.PORT ?? 4000),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  IS_VERCEL: isVercel,
  DIST_DIR: path.resolve(ROOT_DIR, 'dist'),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? '*',
} as const;
