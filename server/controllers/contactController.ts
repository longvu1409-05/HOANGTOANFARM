import { Request, Response } from 'express';
import { contactRepo } from '../repositories/contactRepo';
import { ContactStatus } from '../types/backend.types';
import { sendBadRequest, sendCreated, sendNotFound, sendOk } from '../utils/response';
import { isValidEmail, isValidPhone, normalizePhone } from '../utils/validators';

export const contactController = {
  create(req: Request, res: Response) {
    const fullName = String(req.body?.fullName ?? '').trim();
    const rawPhone = String(req.body?.phone ?? '').trim();
    const email = String(req.body?.email ?? '').trim();
    const subject = String(req.body?.subject ?? 'Tư vấn đặt hàng').trim() || 'Tư vấn đặt hàng';
    const message = String(req.body?.message ?? '').trim();

    if (fullName.length < 2) {
      return sendBadRequest(res, 'Vui lòng nhập họ và tên tối thiểu 2 ký tự.');
    }
    if (!isValidPhone(rawPhone)) {
      return sendBadRequest(res, 'Số điện thoại liên hệ không hợp lệ.');
    }
    if (email && !isValidEmail(email)) {
      return sendBadRequest(res, 'Địa chỉ email không đúng định dạng.');
    }
    if (message.length < 5) {
      return sendBadRequest(res, 'Nội dung cần tư vấn phải có ít nhất 5 ký tự.');
    }

    const created = contactRepo.create({
      fullName,
      phone: normalizePhone(rawPhone),
      email,
      subject,
      message,
    });

    return sendCreated(
      res,
      created,
      'Đã gửi thông tin liên hệ! Hoàng Toàn Farm sẽ phản hồi sớm nhất.'
    );
  },

  list(_req: Request, res: Response) {
    return sendOk(res, contactRepo.findAll());
  },

  updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    const status = String(req.body?.status ?? '') as ContactStatus;
    if (!Number.isInteger(id) || id <= 0) {
      return sendBadRequest(res, 'ID liên hệ không hợp lệ.');
    }
    if (status !== 'new' && status !== 'replied') {
      return sendBadRequest(res, 'Trạng thái phải là "new" hoặc "replied".');
    }

    const updated = contactRepo.updateStatus(id, status);
    if (!updated) {
      return sendNotFound(res, 'Không tìm thấy yêu cầu liên hệ.');
    }
    return sendOk(res, updated, 'Đã cập nhật trạng thái xử lý liên hệ.');
  },
};
