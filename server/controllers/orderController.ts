import { Request, Response } from 'express';
import { orderRepo } from '../repositories/orderRepo.js';
import { productRepo } from '../repositories/productRepo.js';
import { OrderStatus } from '../types/backend.types.js';
import { formatVnd, generateOrderCode } from '../utils/formatters.js';
import { sendBadRequest, sendCreated, sendNotFound, sendOk } from '../utils/response.js';
import { ALLOWED_ORDER_STATUSES, validateCreateOrder } from '../utils/validators.js';

export const orderController = {
  create(req: Request, res: Response) {
    const { error, value } = validateCreateOrder(req.body ?? {});
    if (error || !value) {
      return sendBadRequest(res, error ?? 'Dữ liệu đơn hàng không hợp lệ.');
    }

    const product = productRepo.findById(value.productId);
    if (!product) {
      return sendNotFound(res, 'Sản phẩm bạn chọn không tồn tại.');
    }

    const totalPriceVnd = product.price_vnd * value.quantity;
    const order = orderRepo.create({
      orderCode: generateOrderCode(),
      productId: product.id,
      productName: product.name,
      unitPriceVnd: product.price_vnd,
      quantity: value.quantity,
      totalPriceVnd,
      customerName: value.customerName,
      customerPhone: value.customerPhone,
      note: value.note ?? '',
    });

    return sendCreated(
      res,
      {
        ...order,
        totalPriceLabel: formatVnd(order.total_price_vnd),
      },
      `Đặt quà thành công! Mã đơn của bạn là ${order.order_code}.`
    );
  },

  list(req: Request, res: Response) {
    const phone = typeof req.query.phone === 'string' ? req.query.phone : undefined;
    const code = typeof req.query.code === 'string' ? req.query.code : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;

    const orders = orderRepo.findAll({ phone, code, status });
    const summary = orderRepo.getSummary();

    return sendOk(res, {
      summary,
      orders,
    });
  },

  updateStatus(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return sendBadRequest(res, 'ID đơn hàng không hợp lệ.');
    }

    const status = String(req.body?.status ?? '') as OrderStatus;
    if (!ALLOWED_ORDER_STATUSES.includes(status)) {
      return sendBadRequest(
        res,
        `Trạng thái không hợp lệ. Chỉ chấp nhận: ${ALLOWED_ORDER_STATUSES.join(', ')}.`
      );
    }

    const existing = orderRepo.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Không tìm thấy đơn hàng.');
    }

    const updated = orderRepo.updateStatus(id, status);
    return sendOk(res, updated, `Đã cập nhật trạng thái đơn ${existing.order_code}.`);
  },
};
