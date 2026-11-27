import { OrderDto } from '../../services/orderApi';
import { ProductItem } from '../../types/farm.types';

export type ChartRange = 'hours' | 'day' | 'week' | 'month';

export interface ChartBarPoint {
  label: string;
  revenueVnd: number;
  orderCount: number;
  heightPct: number;
}

export interface ProductSalesRow {
  id: string;
  name: string;
  category: string;
  image: string;
  soldQty: number;
  revenueVnd: number;
  sharePct: string;
  isTop: boolean;
}

/**
 * Chuyển chuỗi thời gian từ Supabase Postgres sang đối tượng Date chính xác theo múi giờ máy khách
 */
export function parseOrderDate(raw: string): Date {
  if (!raw) return new Date();
  const normalized = raw.trim().replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

/**
 * Định dạng tiền ngắn gọn cho trục Y biểu đồ (ví dụ: 1.500.000 -> "1,5tr", 400.000 -> "400k")
 */
export function formatCompactVnd(amount: number): string {
  if (amount <= 0) return '0đ';
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    const text = Number.isInteger(millions)
      ? String(millions)
      : millions.toFixed(millions < 10 ? 2 : 1).replace(/\.?0+$/, '');
    return `${text.replace('.', ',')}tr`;
  }
  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}k`;
  }
  return `${amount}đ`;
}

/**
 * Làm tròn trần trục Y đẹp mắt dựa trên giá trị cột cao nhất thực tế
 */
function computeNiceCeiling(maxVal: number): number {
  if (maxVal <= 0) return 1_000_000;
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxVal)));
  const normalized = maxVal / magnitude;
  let niceFactor = 10;
  if (normalized <= 1.2) niceFactor = 1.2;
  else if (normalized <= 1.5) niceFactor = 1.5;
  else if (normalized <= 2) niceFactor = 2;
  else if (normalized <= 3) niceFactor = 3;
  else if (normalized <= 4) niceFactor = 4;
  else if (normalized <= 5) niceFactor = 5;
  else if (normalized <= 6) niceFactor = 6;
  else if (normalized <= 8) niceFactor = 8;
  return niceFactor * magnitude;
}

function toYmd(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Tổng hợp dữ liệu biểu đồ cột 100% từ các đơn hàng thật trên Supabase (không bao gồm đơn đã hủy)
 */
export function buildRealSalesChart(params: {
  orders: OrderDto[];
  range: ChartRange;
  fromDate: string;
  toDate: string;
}): {
  bars: ChartBarPoint[];
  yTicks: string[];
  periodRevenueVnd: number;
  periodOrdersCount: number;
} {
  const { orders, range, fromDate, toDate } = params;
  const validOrders = orders.filter((o) => o.status !== 'cancelled');

  const parsedOrders = validOrders.map((order) => ({
    order,
    date: parseOrderDate(order.created_at),
  }));

  const rawBuckets: { label: string; revenueVnd: number; orderCount: number }[] = [];

  if (range === 'hours') {
    // Khung giờ trong ngày được chọn ở ô "Đến ngày" (mặc định hôm nay)
    const targetYmd = toDate || toYmd(new Date());
    for (let h = 0; h < 24; h += 2) {
      const slotOrders = parsedOrders.filter(({ date }) => {
        return toYmd(date) === targetYmd && date.getHours() >= h && date.getHours() < h + 2;
      });
      rawBuckets.push({
        label: `${String(h).padStart(2, '0')}h`,
        revenueVnd: slotOrders.reduce((s, x) => s + x.order.total_price_vnd, 0),
        orderCount: slotOrders.length,
      });
    }
  } else if (range === 'day') {
    // Theo từng ngày từ fromDate -> toDate (tối đa 14 cột gần nhất để dễ nhìn)
    const end = toDate ? new Date(`${toDate}T23:59:59`) : new Date();
    const startRaw = fromDate ? new Date(`${fromDate}T00:00:00`) : new Date(end.getTime() - 6 * 86400000);
    const diffDays = Math.max(0, Math.round((end.getTime() - startRaw.getTime()) / 86400000));
    const totalDays = Math.min(14, Math.max(7, diffDays + 1));
    const start = new Date(end.getTime() - (totalDays - 1) * 86400000);

    for (let i = 0; i < totalDays; i++) {
      const dayDate = new Date(start.getTime() + i * 86400000);
      const ymd = toYmd(dayDate);
      const label = `${String(dayDate.getDate()).padStart(2, '0')}/${String(
        dayDate.getMonth() + 1
      ).padStart(2, '0')}`;
      const dayOrders = parsedOrders.filter(({ date }) => toYmd(date) === ymd);
      rawBuckets.push({
        label,
        revenueVnd: dayOrders.reduce((s, x) => s + x.order.total_price_vnd, 0),
        orderCount: dayOrders.length,
      });
    }
  } else if (range === 'week') {
    // 4 tuần trong tháng của toDate
    const ref = toDate ? new Date(`${toDate}T12:00:00`) : new Date();
    const year = ref.getFullYear();
    const month = ref.getMonth();
    const weekRanges = [
      { label: 'Tuần 1 (1–7)', min: 1, max: 7 },
      { label: 'Tuần 2 (8–14)', min: 8, max: 14 },
      { label: 'Tuần 3 (15–21)', min: 15, max: 21 },
      { label: 'Tuần 4 (22+)', min: 22, max: 31 },
    ];
    for (const wk of weekRanges) {
      const wkOrders = parsedOrders.filter(({ date }) => {
        const d = date.getDate();
        return date.getFullYear() === year && date.getMonth() === month && d >= wk.min && d <= wk.max;
      });
      rawBuckets.push({
        label: wk.label,
        revenueVnd: wkOrders.reduce((s, x) => s + x.order.total_price_vnd, 0),
        orderCount: wkOrders.length,
      });
    }
  } else {
    // 12 tháng trong năm của toDate
    const ref = toDate ? new Date(`${toDate}T12:00:00`) : new Date();
    const year = ref.getFullYear();
    for (let m = 0; m < 12; m++) {
      const mOrders = parsedOrders.filter(
        ({ date }) => date.getFullYear() === year && date.getMonth() === m
      );
      rawBuckets.push({
        label: `T${m + 1}`,
        revenueVnd: mOrders.reduce((s, x) => s + x.order.total_price_vnd, 0),
        orderCount: mOrders.length,
      });
    }
  }

  const maxRev = Math.max(0, ...rawBuckets.map((b) => b.revenueVnd));
  const ceiling = computeNiceCeiling(maxRev);

  const yTicks = [
    formatCompactVnd(ceiling),
    formatCompactVnd((ceiling * 3) / 4),
    formatCompactVnd(ceiling / 2),
    formatCompactVnd(ceiling / 4),
    '0đ',
  ];

  const bars: ChartBarPoint[] = rawBuckets.map((b) => ({
    ...b,
    heightPct: b.revenueVnd > 0 ? Math.max(6, Math.round((b.revenueVnd / ceiling) * 100)) : 0,
  }));

  return {
    bars,
    yTicks,
    periodRevenueVnd: rawBuckets.reduce((s, b) => s + b.revenueVnd, 0),
    periodOrdersCount: rawBuckets.reduce((s, b) => s + b.orderCount, 0),
  };
}

/**
 * Thống kê chính xác 100% số lượng bán & tỷ trọng doanh thu từng Sản phẩm hoặc Danh mục từ đơn hàng thật
 */
export function buildRealProductBreakdown(params: {
  orders: OrderDto[];
  products: ProductItem[];
  mode: 'product' | 'category';
}): ProductSalesRow[] {
  const { orders, products, mode } = params;
  const validOrders = orders.filter((o) => o.status !== 'cancelled');

  const productMap = new Map<string, ProductItem>();
  for (const p of products) productMap.set(p.id, p);

  if (mode === 'category') {
    const catStats = new Map<
      string,
      { soldQty: number; revenueVnd: number; thumb: string }
    >();

    for (const p of products) {
      const cat = p.category || 'Trái cây tươi';
      if (!catStats.has(cat)) {
        catStats.set(cat, { soldQty: 0, revenueVnd: 0, thumb: p.image });
      }
    }

    for (const order of validOrders) {
      if (order.items && order.items.length > 0) {
        for (const it of order.items) {
          const prod = productMap.get(it.product_id);
          const cat = prod?.category || 'Trái cây tươi';
          const curr = catStats.get(cat) ?? {
            soldQty: 0,
            revenueVnd: 0,
            thumb: prod?.image ?? products[0]?.image ?? '',
          };
          curr.soldQty += it.quantity;
          curr.revenueVnd += it.subtotal_vnd;
          catStats.set(cat, curr);
        }
      } else {
        const prod = productMap.get(order.product_id);
        const cat = prod?.category || 'Trái cây tươi';
        const curr = catStats.get(cat) ?? {
          soldQty: 0,
          revenueVnd: 0,
          thumb: prod?.image ?? products[0]?.image ?? '',
        };
        curr.soldQty += order.quantity;
        curr.revenueVnd += order.total_price_vnd;
        catStats.set(cat, curr);
      }
    }

    const totalRev = Array.from(catStats.values()).reduce((s, c) => s + c.revenueVnd, 0);
    return Array.from(catStats.entries())
      .map(([cat, stat]) => ({
        id: cat,
        name: cat,
        category: `${stat.revenueVnd.toLocaleString('vi-VN')}đ doanh thu`,
        image: stat.thumb,
        soldQty: stat.soldQty,
        revenueVnd: stat.revenueVnd,
        sharePct: totalRev > 0 ? ((stat.revenueVnd / totalRev) * 100).toFixed(1) : '0.0',
        isTop: false,
      }))
      .sort((a, b) => b.revenueVnd - a.revenueVnd || b.soldQty - a.soldQty)
      .map((row, idx) => ({ ...row, isTop: idx === 0 && row.soldQty > 0 }));
  }

  // Chế độ theo từng Sản phẩm cụ thể
  const prodStats = new Map<string, { soldQty: number; revenueVnd: number }>();
  for (const order of validOrders) {
    if (order.items && order.items.length > 0) {
      for (const it of order.items) {
        const curr = prodStats.get(it.product_id) ?? { soldQty: 0, revenueVnd: 0 };
        curr.soldQty += it.quantity;
        curr.revenueVnd += it.subtotal_vnd;
        prodStats.set(it.product_id, curr);
      }
    } else {
      const curr = prodStats.get(order.product_id) ?? { soldQty: 0, revenueVnd: 0 };
      curr.soldQty += order.quantity;
      curr.revenueVnd += order.total_price_vnd;
      prodStats.set(order.product_id, curr);
    }
  }

  const totalRev = Array.from(prodStats.values()).reduce((s, p) => s + p.revenueVnd, 0);

  return products
    .map((p) => {
      const st = prodStats.get(p.id) ?? { soldQty: 0, revenueVnd: 0 };
      return {
        id: p.id,
        name: p.name,
        category: `${p.category || 'Trái cây tươi'} · ${st.revenueVnd.toLocaleString('vi-VN')}đ`,
        image: p.image,
        soldQty: st.soldQty,
        revenueVnd: st.revenueVnd,
        sharePct: totalRev > 0 ? ((st.revenueVnd / totalRev) * 100).toFixed(1) : '0.0',
        isTop: false,
      };
    })
    .sort((a, b) => b.revenueVnd - a.revenueVnd || b.soldQty - a.soldQty)
    .slice(0, 5)
    .map((row, idx) => ({ ...row, isTop: idx === 0 && row.soldQty > 0 }));
}
