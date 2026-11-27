import fs from 'node:fs';
import path from 'node:path';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { apiRouter } from './routes/index';

/**
 * Khởi tạo ứng dụng Express (dùng chung cho cả máy chủ local và Vercel Serverless Function)
 */
export function createApp() {
  const app = express();

  app.use(cors({ origin: ENV.CORS_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));

  // Đảm bảo đường dẫn luôn có tiền tố /api khi chạy qua Vercel Serverless Rewrite
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (ENV.IS_VERCEL && !req.url.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    }
    next();
  });

  // Các API chính dưới tiền tố /api
  app.use('/api', apiRouter);

  // Khi chưa tìm thấy API route thì trả về JSON 404 rõ ràng
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API endpoint không tồn tại.' });
  });

  // Chỉ phục vụ thư mục tĩnh dist/ khi chạy Node server độc lập (trên Vercel do CDN đảm nhiệm)
  if (!ENV.IS_VERCEL && fs.existsSync(ENV.DIST_DIR)) {
    app.use(express.static(ENV.DIST_DIR));
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET') return next();
      res.sendFile(path.join(ENV.DIST_DIR, 'index.html'));
    });
  }

  // Xử lý lỗi hệ thống tập trung
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Server Error]', err);
    res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra trên máy chủ. Vui lòng thử lại sau.',
    });
  });

  return app;
}
