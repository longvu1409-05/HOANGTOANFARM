import { Request, Response } from 'express';
import { orderRepo } from '../repositories/orderRepo.js';
import { productRepo } from '../repositories/productRepo.js';
import { OrderStatus } from '../types/backend.types.js';
import { formatVnd, generateOrderCode } from '../utils/formatters.js';
import { sendBadRequest, sendCreated, sendNotFound, sendOk } from '../utils/response.js';
import { ALLOWED_ORDER_STATUSES, validateCreateOrder } from '../utils/validators.js';
import { extractBearerToken, verifyAdminToken } from '../utils/adminAuth.js';

export const orderController = {
  async create(req: Request, res: Response) {
    const { error, value } = validateCreateOrder((req.body ?? {}) as Record<string, unknown>);
    if (error || !value) {
      return sendBadRequest(res, error ?? 'Dữ liệu đơn hàng không hợp lệ.');
    }

    const lines = [];
    let totalPriceVnd = 0;

    for (const item of value.items) {
      const product = await productRepo.findById(item.productId);
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
      const order = await orderRepo.create({
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

  async list(req: Request, res: Response) {
    const phone = typeof req.query.phone === 'string' ? req.query.phone.trim() : undefined;
    const code = typeof req.query.code === 'string' ? req.query.code.trim() : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : undefined;

    const isAdmin = Boolean(verifyAdminToken(extractBearerToken(req)));
    // Khách vãng lai chỉ được tra cứu đơn của mình khi truyền SĐT hoặc Mã đơn hàng
    if (!isAdmin && !phone && !code) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập Quản trị để xem toàn bộ danh sách đơn hàng.',
      });
    }

    const [orders, summary] = await Promise.all([
      orderRepo.findAll({ phone, code, status }),
      isAdmin
        ? orderRepo.getSummary()
        : Promise.resolve({ totalOrders: 0, totalRevenueVnd: 0, pendingOrders: 0 }),
    ]);

    return sendOk(res, {
      summary,
      orders,
    });
  },

  async updateStatus(req: Request, res: Response) {
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

    const existing = await orderRepo.findById(id);
    if (!existing) {
      return sendNotFound(res, 'Không tìm thấy đơn hàng.');
    }

    const updated = await orderRepo.updateStatus(id, status);
    return sendOk(res, updated, `Đã cập nhật trạng thái đơn ${existing.order_code}.`);
  },
};
