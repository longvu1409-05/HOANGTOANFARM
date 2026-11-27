import type { IncomingMessage, ServerResponse } from 'node:http';
import { createApp } from '../server/app';

const app = createApp();

/**
 * Vercel Serverless Function entrypoint xử lý toàn bộ các route /api/*
 */
export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req, res);
}
