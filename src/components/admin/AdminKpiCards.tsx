import React from 'react';
import { formatCompactVnd } from './adminAnalytics';

interface AdminKpiCardsProps {
  totalRevenueVnd: number;
  confirmedRevenueVnd: number;
  totalOrders: number;
  pendingOrders: number;
  productsCount: number;
  inStockProductsCount: number;
  totalStockUnits: number;
  totalSoldUnits: number;
  uniqueOrderCustomers: number;
  contactsCount: number;
  repliedContactsCount: number;
  subscribersCount: number;
}

/**
 * Hàng 4 thẻ KPI tính toán 100% từ dữ liệu thực tế trên Supabase (không dùng bất kỳ con số giả định nào)
 */
export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({
  totalRevenueVnd,
  confirmedRevenueVnd,
  totalOrders,
  pendingOrders,
  productsCount,
  inStockProductsCount,
  totalStockUnits,
  totalSoldUnits,
  uniqueOrderCustomers,
  contactsCount,
  repliedContactsCount,
  subscribersCount,
}) => {
  const validOrdersCount = Math.max(0, totalOrders);
  const avgOrderVnd = validOrdersCount > 0 ? Math.round(totalRevenueVnd / validOrdersCount) : 0;

  // % doanh thu đã xác nhận / đang giao / hoàn tất trên tổng doanh thu
  const revenueConfirmedPct =
    totalRevenueVnd > 0
      ? Math.min(100, Math.round((confirmedRevenueVnd / totalRevenueVnd) * 100))
      : 0;

  // % đơn hàng đã được Admin xử lý (không còn ở trạng thái pending)
  const ordersProcessedPct =
    totalOrders > 0
      ? Math.min(100, Math.round(((totalOrders - pendingOrders) / totalOrders) * 100))
      : 0;

  // % lượng hàng còn trong kho so với tổng (tồn kho hiện tại + số phần đã bán)
  const totalCapacity = totalStockUnits + totalSoldUnits;
  const stockRemainingPct =
    totalCapacity > 0 ? Math.min(100, Math.round((totalStockUnits / totalCapacity) * 100)) : 0;

  // % liên hệ khách hàng đã được phản hồi (nếu chưa có liên hệ chờ thì đạt 100%)
  const contactHandledPct =
    contactsCount > 0
      ? Math.min(100, Math.round((repliedContactsCount / contactsCount) * 100))
      : uniqueOrderCustomers > 0
        ? 100
        : 0;

  return (
    <section className="htf-adm-kpis" aria-label="Chỉ số kinh doanh thực tế">
      {/* Thẻ 1: Tổng Doanh Thu thực tế */}
      <article className="htf-kpi-card">
        <div>
          <div className="htf-kpi-card__top">
            <span className="htf-kpi-card__label">Total Sale · Doanh thu</span>
            <span className="htf-kpi-card__pill htf-kpi-card__pill--pink">
              TB {formatCompactVnd(avgOrderVnd)}/đơn
            </span>
          </div>
          <div className="htf-kpi-card__value">
            {totalRevenueVnd.toLocaleString('vi-VN')}đ
          </div>
        </div>

        <div className="htf-kpi-card__progress-wrap" title="Tỷ lệ doanh thu đã xác nhận">
          <span className="htf-kpi-card__pct" style={{ color: '#f73164' }}>
            {revenueConfirmedPct}% đã duyệt
          </span>
          <div className="htf-kpi-card__track">
            <div
              className="htf-kpi-card__fill htf-kpi-card__fill--pink"
              style={{ width: `${revenueConfirmedPct}%` }}
            />
          </div>
        </div>
        <div className="htf-kpi-card__corner htf-kpi-card__corner--pink">↗</div>
      </article>

      {/* Thẻ 2: Tổng Đơn Hàng thực tế */}
      <article className="htf-kpi-card">
        <div>
          <div className="htf-kpi-card__top">
            <span className="htf-kpi-card__label">Total Orders · Đơn đặt hàng</span>
            <span className="htf-kpi-card__pill htf-kpi-card__pill--green">
              {pendingOrders} chờ xử lý
            </span>
          </div>
          <div className="htf-kpi-card__value">
            {totalOrders.toLocaleString('vi-VN')} đơn
            <span style={{ color: '#51bb25', fontSize: 18 }}>↗</span>
          </div>
        </div>

        <div className="htf-kpi-card__progress-wrap" title="Tỷ lệ đơn đã xử lý">
          <span className="htf-kpi-card__pct" style={{ color: '#51bb25' }}>
            {ordersProcessedPct}% đã xử lý
          </span>
          <div className="htf-kpi-card__track">
            <div
              className="htf-kpi-card__fill htf-kpi-card__fill--green"
              style={{ width: `${ordersProcessedPct}%` }}
            />
          </div>
        </div>
        <div className="htf-kpi-card__corner htf-kpi-card__corner--green">↗</div>
      </article>

      {/* Thẻ 3: Kho hàng thực tế (Solid Royal Blue) */}
      <article className="htf-kpi-card htf-kpi-card--solid-blue">
        <div>
          <div className="htf-kpi-card__top">
            <span className="htf-kpi-card__label">Active Inventory · Tồn kho</span>
            <span className="htf-kpi-card__pill htf-kpi-card__pill--white">
              {inStockProductsCount}/{productsCount} còn hàng
            </span>
          </div>
          <div className="htf-kpi-card__value">
            {totalStockUnits.toLocaleString('vi-VN')} phần
            <span style={{ fontSize: 18, opacity: 0.9 }}>↗</span>
          </div>
        </div>

        <div
          className="htf-kpi-card__progress-wrap"
          title={`Đã bán ${totalSoldUnits} phần · Còn lại ${totalStockUnits} phần`}
        >
          <span className="htf-kpi-card__pct" style={{ color: '#ffffff' }}>
            Đã bán {totalSoldUnits} ({stockRemainingPct}% còn)
          </span>
          <div className="htf-kpi-card__track">
            <div
              className="htf-kpi-card__fill htf-kpi-card__fill--white"
              style={{ width: `${stockRemainingPct}%` }}
            />
          </div>
        </div>
        <div className="htf-kpi-card__corner htf-kpi-card__corner--white">↗</div>
      </article>

      {/* Thẻ 4: Khách hàng & Liên hệ thực tế */}
      <article className="htf-kpi-card">
        <div>
          <div className="htf-kpi-card__top">
            <span className="htf-kpi-card__label">Customers · Khách mua hàng</span>
            <span className="htf-kpi-card__pill htf-kpi-card__pill--blue">
              {contactsCount} LH · {subscribersCount} tin
            </span>
          </div>
          <div className="htf-kpi-card__value">
            {uniqueOrderCustomers.toLocaleString('vi-VN')} khách
            <span style={{ color: '#4466f2', fontSize: 18 }}>↗</span>
          </div>
        </div>

        <div className="htf-kpi-card__progress-wrap" title="Tỷ lệ phản hồi liên hệ khách hàng">
          <span className="htf-kpi-card__pct" style={{ color: '#4466f2' }}>
            {contactHandledPct}% phản hồi
          </span>
          <div className="htf-kpi-card__track">
            <div
              className="htf-kpi-card__fill htf-kpi-card__fill--blue"
              style={{ width: `${contactHandledPct}%` }}
            />
          </div>
        </div>
        <div className="htf-kpi-card__corner htf-kpi-card__corner--blue">↗</div>
      </article>
    </section>
  );
};
