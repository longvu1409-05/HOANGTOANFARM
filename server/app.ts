import fs from 'node:fs';
import path from 'node:path';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { apiRouter } from './routes/index.js';

/**
 * Khởi tạo ứng dụng Express (CORS, JSON parser, /api routes, phục vụ FE khi build)
 */
export function createApp() {
  const app = express();

  app.use(cors({ origin: ENV.CORS_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));

  // Các API chính dưới tiền tố /api
  app.use('/api', apiRouter);

  // Khi chưa tìm thấy API route thì trả về JSON 404 rõ ràng
  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API endpoint không tồn tại.' });
  });

  // Nếu đã build frontend (thư mục dist/) thì phục vụ luôn giao diện tĩnh ở chế độ production
  if (fs.existsSync(ENV.DIST_DIR)) {
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
