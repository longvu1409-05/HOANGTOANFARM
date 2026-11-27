/**
 * Sinh mã đơn hàng dễ đọc dạng: HTF-20261127-4821
 */
export function generateOrderCode(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `HTF-${y}${m}${d}-${rand}`;
}

/**
 * Định dạng số tiền sang chuỗi VND (ví dụ: 1080000 -> "1.080.000đ")
 */
export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')}đ`;
}
