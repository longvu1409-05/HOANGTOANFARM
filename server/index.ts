import { ENV } from './config/env.js';
import { getDatabase } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import { createApp } from './app.js';

/**
 * Điểm khởi chạy Backend Hoàng Toàn Farm
 */
function bootstrap() {
  const db = getDatabase();
  seedDatabase(db);

  const app = createApp();
  app.listen(ENV.PORT, () => {
    console.log(`[Hoàng Toàn Farm BE] Đang chạy tại http://localhost:${ENV.PORT}`);
    console.log(`[SQLite DB] ${ENV.DB_PATH}`);
  });
}

bootstrap();
