export interface PromoInfo {
  code: string;
  percent: number;
  label: string;
}

/**
 * Danh sách mã ưu đãi hợp lệ (tặng khi khách Đăng ký nhận tin hoặc dịp khuyến mãi)
 */
export const PROMO_CODES: Record<string, PromoInfo> = {
  HTF10: {
    code: 'HTF10',
    percent: 10,
    label: 'Giảm 10% ưu đãi thành viên Bản tin',
  },
  VUSUA15: {
    code: 'VUSUA15',
    percent: 15,
    label: 'Giảm 15% ưu đãi mùa vụ Hoàng Toàn Farm',
  },
};

export function calculatePromoDiscount(subtotalVnd: number, rawCode?: string): {
  promo: PromoInfo | null;
  discountVnd: number;
  finalTotalVnd: number;
} {
  const key = (rawCode ?? '').trim().toUpperCase();
  if (!key) {
    return { promo: null, discountVnd: 0, finalTotalVnd: subtotalVnd };
  }

  const promo = PROMO_CODES[key] ?? null;
  if (!promo) {
    return { promo: null, discountVnd: 0, finalTotalVnd: subtotalVnd };
  }

  const discountVnd = Math.round((subtotalVnd * promo.percent) / 100);
  return {
    promo,
    discountVnd,
    finalTotalVnd: Math.max(0, subtotalVnd - discountVnd),
  };
}
