import { CreateOrderInput, CreateProductInput, OrderStatus } from '../types/backend.types.js';

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

export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

/**
 * Kiểm tra dữ liệu tạo đơn hàng (hỗ trợ cả 1 sản phẩm cũ lẫn giỏ hàng nhiều sản phẩm)
 */
export function validateCreateOrder(body: Record<string, unknown>): {
  error?: string;
  value?: CreateOrderInput;
} {
  const customerName = String(body.customerName ?? '').trim();
  const rawPhone = String(body.customerPhone ?? '').trim();
  const address = String(body.address ?? '').trim();
  const note = String(body.note ?? '').trim();

  let items: { productId: string; quantity: number }[] = [];

  if (Array.isArray(body.items) && body.items.length > 0) {
    items = body.items.map((item) => ({
      productId: String((item as Record<string, unknown>)?.productId ?? '').trim(),
      quantity: Number((item as Record<string, unknown>)?.quantity ?? 1),
    }));
  } else if (body.productId) {
    items = [
      {
        productId: String(body.productId).trim(),
        quantity: Number(body.quantity ?? 1),
      },
    ];
  }

  if (items.length === 0) {
    return { error: 'Giỏ hàng trống, vui lòng chọn ít nhất 1 sản phẩm.' };
  }
  for (const item of items) {
    if (!item.productId) {
      return { error: 'Sản phẩm trong đơn hàng không hợp lệ.' };
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) {
      return { error: 'Số lượng mỗi sản phẩm phải là số nguyên từ 1 đến 50.' };
    }
  }

  if (customerName.length < 2) {
    return { error: 'Họ và tên cần tối thiểu 2 ký tự.' };
  }
  if (!isValidPhone(rawPhone)) {
    return { error: 'Số điện thoại không hợp lệ (ví dụ: 0989604818).' };
  }

  return {
    value: {
      items,
      customerName,
      customerPhone: normalizePhone(rawPhone),
      address,
      note,
    },
  };
}

/**
 * Kiểm tra dữ liệu thêm / cập nhật sản phẩm
 */
export function validateProductInput(body: Record<string, unknown>): {
  error?: string;
  value?: CreateProductInput;
} {
  const name = String(body.name ?? '').trim();
  const category = String(body.category ?? 'Trái cây tươi').trim() || 'Trái cây tươi';
  const description = String(body.description ?? '').trim();
  const spec1 = String(body.spec1 ?? '').trim();
  const spec2 = String(body.spec2 ?? '').trim();
  const unit = String(body.unit ?? '').trim();
  const priceVnd = Number(body.priceVnd);
  const stock = Number(body.stock ?? 50);
  const imageFile = String(body.imageFile ?? 'imgRectangle16.png').trim() || 'imgRectangle16.png';
  const isFeatured = Boolean(body.isFeatured);

  if (name.length < 3) return { error: 'Tên sản phẩm phải có ít nhất 3 ký tự.' };
  if (!spec1) return { error: 'Vui lòng nhập dòng thông số 1 (ví dụ: Quả to 450 - 550g).' };
  if (!spec2) return { error: 'Vui lòng nhập dòng thông số 2 (ví dụ: Ngọt đậm, vỏ mỏng).' };
  if (!unit) return { error: 'Vui lòng nhập đơn vị đóng gói (ví dụ: Hộp 6 quả).' };
  if (!Number.isFinite(priceVnd) || priceVnd < 1000) {
    return { error: 'Giá bán phải là số lớn hơn hoặc bằng 1.000đ.' };
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: 'Số lượng tồn kho phải là số nguyên >= 0.' };
  }

  return {
    value: {
      id: body.id ? String(body.id).trim() : undefined,
      name,
      category,
      description,
      spec1,
      spec2,
      unit,
      priceVnd: Math.round(priceVnd),
      imageFile,
      stock,
      isFeatured,
    },
  };
}
