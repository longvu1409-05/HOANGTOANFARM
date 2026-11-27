import React from 'react';

interface AdminKpiCardsProps {
  totalRevenueVnd: number;
  totalOrders: number;
  pendingOrders: number;
  productsCount: number;
  totalStockUnits: number;
  totalCustomersReach: number;
}

/**
 * Hàng 4 thẻ KPI chuẩn phong cách Creative E-Shop Admin:
 * 1. Tổng doanh thu (Hồng)
 * 2. Tổng đơn hàng (Xanh lá)
 * 3. Kho sản phẩm đang bán (Nền xanh dương nổi bật)
 * 4. Khách hàng & Tương tác (Xanh dương trên nền trắng)
 */
export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({
  totalRevenueVnd,
  totalOrders,
  pendingOrders,
  productsCount,
  totalStockUnits,
  totalCustomersReach,
}) => {
  const confirmedRatio =
    totalOrders > 0
      ? Math.min(98, Math.max(45, Math.round(((totalOrders - pendingOrders) / totalOrders) * 100)))
      : 75;

  return (
    <section className="htf-adm-kpis" aria-label="Chỉ số kinh doanh chính">
      {/* Thẻ 1: Tổng Doanh Thu (Pink) */}
      <article className="htf-kpi-card">
        <div>
          <div className="htf-kpi-card__top">
            <span className="htf-kpi-card__label">Total Sale · Doanh thu</span>
            <span className="htf-kpi-card__pill htf-kpi-card__pill--pink">+12.4% ▲</span>
          </div>
          <div className="htf-kpi-card__value">
            {totalRevenueVnd.toLocaleString('vi-VN')}đ
          </div>
        </div>

        <div className="htf-kpi-card__progress-wrap">
          <span className="htf-kpi-card__pct" style={{ color: '#f73164' }}>
            75%
          </span>
          <div className="htf-kpi-card__track">
            <div
              className="htf-kpi-card__fill htf-kpi-card__fill--pink"
              style={{ width: '75%' }}
            />
          </div>
        </div>
        <div className="htf-kpi-card__corner htf-kpi-card__corner--pink">↗</div>
      </article>

      {/* Thẻ 2: Tổng Đơn Hàng (Green) */}
      <article className="htf-kpi-card">
        <div>
          <div className="htf-kpi-card__top">
            <span className="htf-kpi-card__label">Total Orders · Đơn đặt hàng</span>
            <span className="htf-kpi-card__pill htf-kpi-card__pill--green">
              {pendingOrders} chờ xử lý ▲
            </span>
          </div>
          <div className="htf-kpi-card__value">
            {totalOrders.toLocaleString('vi-VN')} đơn
            <span style={{ color: '#51bb25', fontSize: 18 }}>↗</span>
          </div>
        </div>

        <div className="htf-kpi-card__progress-wrap">
          <span className="htf-kpi-card__pct" style={{ color: '#51bb25' }}>
            {confirmedRatio}%
          </span>
          <div className="htf-kpi-card__track">
            <div
              className="htf-kpi-card__fill htf-kpi-card__fill--green"
              style={{ width: `${confirmedRatio}%` }}
            />
          </div>
        </div>
        <div className="htf-kpi-card__corner htf-kpi-card__corner--green">↗</div>
      </article>

      {/* Thẻ 3: Nền xanh dương đặc trưng (Solid Royal Blue) */}
      <article className="htf-kpi-card htf-kpi-card--solid-blue">
        <div>
          <div className="htf-kpi-card__top">
            <span className="htf-kpi-card__label">Active Inventory · Tồn kho</span>
            <span className="htf-kpi-card__pill htf-kpi-card__pill--white">
              {productsCount} mặt hàng ▲
            </span>
          </div>
          <div className="htf-kpi-card__value">
            {totalStockUnits.toLocaleString('vi-VN')} phần
            <span style={{ fontSize: 18, opacity: 0.9 }}>↗</span>
          </div>
        </div>

        <div className="htf-kpi-card__progress-wrap">
          <span className="htf-kpi-card__pct" style={{ color: '#ffffff' }}>
            84%
          </span>
          <div className="htf-kpi-card__track">
            <div
              className="htf-kpi-card__fill htf-kpi-card__fill--white"
              style={{ width: '84%' }}
            />
          </div>
        </div>
        <div className="htf-kpi-card__corner htf-kpi-card__corner--white">↗</div>
      </article>

      {/* Thẻ 4: Khách hàng & Liên hệ (Blue on White) */}
      <article className="htf-kpi-card">
        <div>
          <div className="htf-kpi-card__top">
            <span className="htf-kpi-card__label">New Customers · Tương tác</span>
            <span className="htf-kpi-card__pill htf-kpi-card__pill--blue">+8.2% ▲</span>
          </div>
          <div className="htf-kpi-card__value">
            {totalCustomersReach.toLocaleString('vi-VN')}
            <span style={{ color: '#4466f2', fontSize: 18 }}>↗</span>
          </div>
        </div>

        <div className="htf-kpi-card__progress-wrap">
          <span className="htf-kpi-card__pct" style={{ color: '#4466f2' }}>
            88%
          </span>
          <div className="htf-kpi-card__track">
            <div
              className="htf-kpi-card__fill htf-kpi-card__fill--blue"
              style={{ width: '88%' }}
            />
          </div>
        </div>
        <div className="htf-kpi-card__corner htf-kpi-card__corner--blue">↗</div>
      </article>
    </section>
  );
};
