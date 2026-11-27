import { Response } from 'express';

/**
 * Chuẩn hóa cấu trúc phản hồi JSON cho toàn bộ API
 */
export function sendOk<T>(res: Response, data: T, message?: string) {
  return res.status(200).json({
    success: true,
    ...(message ? { message } : {}),
    data,
  });
}

export function sendCreated<T>(res: Response, data: T, message: string) {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
}

export function sendBadRequest(res: Response, message: string) {
  return res.status(400).json({
    success: false,
    message,
  });
}

export function sendNotFound(res: Response, message: string) {
  return res.status(404).json({
    success: false,
    message,
  });
}
