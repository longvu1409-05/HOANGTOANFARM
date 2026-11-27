import { Request, Response } from 'express';
import { sendOk } from '../utils/response.js';

export const healthController = {
  check(_req: Request, res: Response) {
    return sendOk(res, {
      service: 'Hoang Toan Farm API',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    });
  },
};
