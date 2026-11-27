import { Request, Response } from 'express';
import { ENV } from '../config/env';
import { getSqliteDb } from '../db/database';
import { getSupabaseClient, getSupabaseKeyType } from '../db/supabaseClient';
import { sendOk } from '../utils/response';

export const healthController = {
  check(_req: Request, res: Response) {
    const supabase = getSupabaseClient();
    const keyType = getSupabaseKeyType();

    return sendOk(res, {
      service: 'Hoang Toan Farm API',
      status: 'healthy',
      environment: ENV.IS_VERCEL ? 'vercel' : ENV.NODE_ENV,
      storage: supabase ? 'supabase' : getSqliteDb() ? 'sqlite' : 'json-store',
      ...(supabase ? { supabaseKeyType: keyType } : {}),
      timestamp: new Date().toISOString(),
    });
  },
};
