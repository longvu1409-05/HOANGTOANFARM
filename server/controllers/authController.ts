import { Request, Response } from 'express';
import { getAdminCredentials } from '../config/env.js';
import {
  createAdminToken,
  extractBearerToken,
  verifyAdminToken,
} from '../utils/adminAuth.js';
import { sendBadRequest, sendOk } from '../utils/response.js';

export const authController = {
  login(req: Request, res: Response) {
    const inputUser = String(req.body?.username ?? '').trim();
    const inputPass = String(req.body?.password ?? '');
    const creds = getAdminCredentials();

    if (!inputUser || !inputPass) {
      return sendBadRequest(res, 'Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
    }

    if (inputUser !== creds.username || inputPass !== creds.password) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản hoặc mật khẩu Quản trị không chính xác.',
      });
    }

    const { token, expiresAt } = createAdminToken(creds.username);
    return sendOk(
      res,
      { token, username: creds.username, expiresAt },
      'Đăng nhập Quản trị thành công!'
    );
  },

  me(req: Request, res: Response) {
    const payload = verifyAdminToken(extractBearerToken(req));
    if (!payload) {
      return res.status(401).json({
        success: false,
        message: 'Chưa đăng nhập Quản trị.',
      });
    }
    return sendOk(res, {
      username: payload.sub,
      expiresAt: new Date(payload.exp).toISOString(),
    });
  },
};
