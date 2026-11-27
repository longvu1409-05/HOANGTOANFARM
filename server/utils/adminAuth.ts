import crypto from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { getAdminCredentials } from '../config/env.js';

interface AdminTokenPayload {
  sub: string;
  role: 'admin';
  exp: number;
}

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 ngày

function signHmac(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

export function createAdminToken(username: string): { token: string; expiresAt: string } {
  const { signingSecret } = getAdminCredentials();
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload: AdminTokenPayload = { sub: username, role: 'admin', exp };
  const encodedPayload = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
  const signature = signHmac(encodedPayload, signingSecret);

  return {
    token: `${encodedPayload}.${signature}`,
    expiresAt: new Date(exp).toISOString(),
  };
}

export function verifyAdminToken(token?: string): AdminTokenPayload | null {
  if (!token || !token.includes('.')) return null;
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const { signingSecret } = getAdminCredentials();
  const expectedSig = signHmac(encodedPayload, signingSecret);

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encodedPayload, 'base64url').toString('utf-8')
    ) as AdminTokenPayload;
    if (parsed.role !== 'admin' || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function extractBearerToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return undefined;
  return header.slice(7).trim();
}

/**
 * Middleware chặn truy cập trái phép vào các API Quản trị
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req);
  const verified = verifyAdminToken(token);
  if (!verified) {
    return res.status(401).json({
      success: false,
      message: 'Phiên đăng nhập Quản trị không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.',
    });
  }
  return next();
}
