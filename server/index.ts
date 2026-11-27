import { ENV } from './config/env';
import { getSqliteDb } from './db/database';
import { getJsonStore } from './db/jsonStore';
import { createApp } from './app';

/**
 * Điểm khởi chạy Backend Hoàng Toàn Farm trên máy local (port 4000)
 */
function bootstrap() {
  const db = getSqliteDb();
  if (!db) {
    getJsonStore();
  }

  const app = createApp();
  app.listen(ENV.PORT, () => {
    console.log(`[Hoàng Toàn Farm BE] Đang chạy tại http://localhost:${ENV.PORT}`);
    console.log(
      db ? `[SQLite DB] ${ENV.DB_PATH}` : `[JSON Store] ${ENV.JSON_DB_PATH}`
    );
  });
}

bootstrap();
