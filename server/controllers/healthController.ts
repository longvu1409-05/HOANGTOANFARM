import { Request, Response } from 'express';
import { ENV } from '../config/env';
import { getSqliteDb } from '../db/database';
import { sendOk } from '../utils/response';

export const healthController = {
  check(_req: Request, res: Response) {
    return sendOk(res, {
      service: 'Hoang Toan Farm API',
      status: 'healthy',
      environment: ENV.IS_VERCEL ? 'vercel' : ENV.NODE_ENV,
      storage: getSqliteDb() ? 'sqlite' : 'json-store',
      timestamp: new Date().toISOString(),
    });
  },
};
