import { CreateOrderInput, OrderStatus } from '../types/backend.types.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0|\+84)[0-9\s.-]{8,13}$/;

export const ALLOWED_ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipping',
  'completed',
  'cancelled',
];

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s.-]/g, '').trim();
}

export function validateCreateOrder(body: Partial<CreateOrderInput>): {
  error?: string;
  value?: CreateOrderInput;
} {
  const productId = String(body.productId ?? '').trim();
  const customerName = String(body.customerName ?? '').trim();
  const rawPhone = String(body.customerPhone ?? '').trim();
  const note = String(body.note ?? '').trim();
  const quantity = Number(body.quantity ?? 1);

  if (!productId) {
    return { error: 'Vui lòng chọn sản phẩm cần đặt.' };
  }
  if (customerName.length < 2) {
    return { error: 'Họ và tên cần tối thiểu 2 ký tự.' };
  }
  if (!PHONE_REGEX.test(rawPhone)) {
    return { error: 'Số điện thoại không hợp lệ (ví dụ: 0989604818).' };
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return { error: 'Số lượng phải là số nguyên từ 1 đến 50.' };
  }

  return {
    value: {
      productId,
      quantity,
      customerName,
      customerPhone: normalizePhone(rawPhone),
      note,
    },
  };
}
