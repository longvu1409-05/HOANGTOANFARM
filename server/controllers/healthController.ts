import { Request, Response } from 'express';
import { ENV } from '../config/env.js';
import { getSupabaseClient } from '../db/supabaseClient.js';
import { sendOk } from '../utils/response.js';

export const healthController = {
  async check(_req: Request, res: Response) {
    const supabase = getSupabaseClient();
    let dbConnected = false;

    if (supabase) {
      const { error } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true });
      dbConnected = !error;
    }

    return sendOk(res, {
      service: 'Hoang Toan Farm API',
      status: dbConnected ? 'healthy' : 'unconfigured',
      environment: ENV.IS_VERCEL ? 'vercel' : ENV.NODE_ENV,
      storage: 'supabase',
      dbConnected,
      timestamp: new Date().toISOString(),
    });
  },
};
