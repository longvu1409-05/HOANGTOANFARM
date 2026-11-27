import fs from 'node:fs';
import path from 'node:path';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { apiRouter } from './routes/index.js';

/**
 * Khởi tạo ứng dụng Express kết nối Supabase (dùng chung cho local và Vercel Serverless)
 */
export function createApp() {
  const app = express();

  app.use(cors({ origin: ENV.CORS_ORIGIN }));
  app.use(express.json({ limit: '1mb' }));

  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (ENV.IS_VERCEL && !req.url.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    }
    next();
  });

  app.use('/api', apiRouter);

  app.use('/api', (_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: 'API endpoint không tồn tại.' });
  });

  if (!ENV.IS_VERCEL && fs.existsSync(ENV.DIST_DIR)) {
    app.use(express.static(ENV.DIST_DIR));
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== 'GET') return next();
      res.sendFile(path.join(ENV.DIST_DIR, 'index.html'));
    });
  }

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[Server Error]', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Đã có lỗi xảy ra trên máy chủ.',
    });
  });

  return app;
}
