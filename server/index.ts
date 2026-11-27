import { ENV } from './config/env.js';
import { getSupabaseClient } from './db/supabaseClient.js';
import { createApp } from './app.js';

function bootstrap() {
  const app = createApp();
  app.listen(ENV.PORT, () => {
    console.log(`[Hoàng Toàn Farm BE] Đang chạy tại http://localhost:${ENV.PORT}`);
    console.log(
      getSupabaseClient()
        ? '[Supabase] Đã kết nối cơ sở dữ liệu Supabase thành công!'
        : '[Cảnh báo] Chưa điền SUPABASE_URL / SUPABASE_SECRET_KEY trong file .env'
    );
  });
}

bootstrap();
