import { Request, Response } from 'express';
import { orderRepo } from '../repositories/orderRepo';
import { productRepo } from '../repositories/productRepo';
import { OrderStatus } from '../types/backend.types';
import { formatVnd, generateOrderCode } from '../utils/formatters';
import { sendBadRequest, sendCreated, sendNotFound, sendOk } from '../utils/response';
import { ALLOWED_ORDER_STATUSES, validateCreateOrder } from '../utils/validators';

export const orderController = {
  create(req: Request, res: Response) {
    const { error, value } = validateCreateOrder((req.body ?? {}) as Record<string, unknown>);
    if (error || !value) {
      return sendBadRequest(res, error ?? 'Dữ liệu đơn hàng không hợp lệ.');
    }

    const lines = [];
    let totalPriceVnd = 0;

    for (const item of value.items) {
      const product = productRepo.findById(item.productId);
      if (!product) {
        return sendNotFound(res, `Sản phẩm "${item.productId}" không tồn tại hoặc đã ngừng bán.`);
      }
      if (product.stock < item.quantity) {
        return sendBadRequest(
          res,
          `Sản phẩm "${product.name}" chỉ còn ${product.stock} phần trong kho.`
        );
      }

      const subtotalVnd = product.price_vnd * item.quantity;
      totalPriceVnd += subtotalVnd;
      lines.push({
        productId: product.id,
        productName: product.name,
        unitPriceVnd: product.price_vnd,
        quantity: item.quantity,
        subtotalVnd,
      });
    }

    try {
      const order = orderRepo.create({
        orderCode: generateOrderCode(),
        lines,
        totalPriceVnd,
        customerName: value.customerName,
        customerPhone: value.customerPhone,
        address: value.address ?? '',
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
    } catch (err) {
      return sendBadRequest(
        res,
        err instanceof Error ? err.message : 'Không thể tạo đơn hàng lúc này.'
      );
    }
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
