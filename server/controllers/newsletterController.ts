import { Request, Response } from 'express';
import { newsletterRepo } from '../repositories/newsletterRepo.js';
import {
  getEmailProviderStatus,
  sendNewsletterBroadcast,
  sendNewsletterWelcomeEmail,
} from '../services/emailService.js';
import { sendBadRequest, sendCreated, sendNotFound, sendOk } from '../utils/response.js';
import { isValidEmail } from '../utils/validators.js';

export const newsletterController = {
  async subscribe(req: Request, res: Response) {
    const rawEmail = String(req.body?.email ?? '').trim();
    if (!isValidEmail(rawEmail)) {
      return sendBadRequest(res, 'Địa chỉ email không hợp lệ.');
    }

    const existing = await newsletterRepo.findByEmail(rawEmail);
    if (existing) {
      return sendOk(
        res,
        { subscriber: existing, alreadySubscribed: true, emailSent: false },
        `Email ${rawEmail} đã đăng ký nhận tin trước đó rồi (Mã ưu đãi của bạn: HTF10)!`
      );
    }

    const created = await newsletterRepo.create(rawEmail);
    const mailRes = await sendNewsletterWelcomeEmail(created.email);

    return sendCreated(
      res,
      { subscriber: created, alreadySubscribed: false, emailSent: mailRes.sent },
      mailRes.sent
        ? `Đăng ký thành công! Đã gửi mã giảm giá 10% (HTF10) tới hộp thư ${created.email}.`
        : `Đã đăng ký nhận ưu đãi thành công! Mã giảm 10% dành cho bạn là: HTF10.`
    );
  },

  async list(_req: Request, res: Response) {
    const subscribers = await newsletterRepo.findAll();
    return sendOk(res, subscribers);
  },

  async broadcast(req: Request, res: Response) {
    const subject = String(req.body?.subject ?? '').trim();
    const content = String(req.body?.content ?? '').trim();
    const promoCode = String(req.body?.promoCode ?? '').trim();

    if (subject.length < 5 || content.length < 10) {
      return sendBadRequest(res, 'Vui lòng nhập tiêu đề (>= 5 ký tự) và nội dung bản tin (>= 10 ký tự).');
    }

    const emailStatus = getEmailProviderStatus();
    if (!emailStatus.configured) {
      return sendBadRequest(
        res,
        'Chưa cấu hình SMTP_USER / SMTP_PASS nên chưa thể gửi email hàng loạt.'
      );
    }

    const subscribers = await newsletterRepo.findAll();
    if (subscribers.length === 0) {
      return sendBadRequest(res, 'Hiện chưa có email khách hàng nào đăng ký nhận tin.');
    }

    const result = await sendNewsletterBroadcast({
      recipients: subscribers.map((s) => s.email),
      subject,
      content,
      promoCode,
    });

    return sendOk(
      res,
      result,
      `Đã gửi bản tin ưu đãi tới ${result.sentCount}/${result.total} email đăng ký!`
    );
  },

  async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return sendBadRequest(res, 'ID người đăng ký không hợp lệ.');
    }

    const deleted = await newsletterRepo.remove(id);
    if (!deleted) {
      return sendNotFound(res, 'Không tìm thấy email cần xóa.');
    }
    return sendOk(res, { id, deleted: true }, 'Đã xóa email khỏi danh sách nhận tin.');
  },
};
