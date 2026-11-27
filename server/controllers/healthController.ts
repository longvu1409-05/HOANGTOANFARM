import { Request, Response } from 'express';
import { ENV } from '../config/env.js';
import { getSupabaseClient } from '../db/supabaseClient.js';
import { getEmailProviderStatus } from '../services/emailService.js';
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

    const emailStatus = getEmailProviderStatus();

    return sendOk(res, {
      service: 'Hoang Toan Farm API',
      status: dbConnected ? 'healthy' : 'unconfigured',
      environment: ENV.IS_VERCEL ? 'vercel' : ENV.NODE_ENV,
      storage: 'supabase',
      dbConnected,
      emailConfigured: emailStatus.configured,
      emailProvider: emailStatus.provider,
      timestamp: new Date().toISOString(),
    });
  },
};
