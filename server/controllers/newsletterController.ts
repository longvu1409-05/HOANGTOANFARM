import { Request, Response } from 'express';
import { newsletterRepo } from '../repositories/newsletterRepo';
import { sendBadRequest, sendCreated, sendOk } from '../utils/response';
import { isValidEmail } from '../utils/validators';

export const newsletterController = {
  subscribe(req: Request, res: Response) {
    const rawEmail = String(req.body?.email ?? '').trim();
    if (!isValidEmail(rawEmail)) {
      return sendBadRequest(res, 'Địa chỉ email không hợp lệ.');
    }

    const existing = newsletterRepo.findByEmail(rawEmail);
    if (existing) {
      return sendOk(
        res,
        { subscriber: existing, alreadySubscribed: true },
        `Email ${rawEmail} đã đăng ký nhận tin trước đó rồi!`
      );
    }

    const created = newsletterRepo.create(rawEmail);
    return sendCreated(
      res,
      { subscriber: created, alreadySubscribed: false },
      `Đã đăng ký nhận ưu đãi thành công cho ${created.email}!`
    );
  },

  list(_req: Request, res: Response) {
    const subscribers = newsletterRepo.findAll();
    return sendOk(res, subscribers);
  },
};
