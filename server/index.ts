import { ENV } from './config/env';
import { getSqliteDb } from './db/database';
import { getJsonStore } from './db/jsonStore';
import { getSupabaseClient, getSupabaseKeyType } from './db/supabaseClient';
import { createApp } from './app';

/**
 * Điểm khởi chạy Backend Hoàng Toàn Farm trên máy local (port 4000)
 */
function bootstrap() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    const db = getSqliteDb();
    if (!db) getJsonStore();
  }

  const app = createApp();
  app.listen(ENV.PORT, () => {
    console.log(`[Hoàng Toàn Farm BE] Đang chạy tại http://localhost:${ENV.PORT}`);
    if (supabase) {
      console.log('[Database] Đã kết nối Supabase Postgres đám mây!');
      if (getSupabaseKeyType() === 'publishable_warning') {
        console.warn(
          '[Cảnh báo] Bạn đang điền Publishable Key thay vì Secret Key (sb_secret_...). Hãy dùng Secret Key cho Backend!'
        );
      }
    } else {
      console.log(
        `[Database] Chưa cấu hình .env Supabase -> đang dùng SQLite tại ${ENV.DB_PATH}`
      );
    }
  });
}

bootstrap();
