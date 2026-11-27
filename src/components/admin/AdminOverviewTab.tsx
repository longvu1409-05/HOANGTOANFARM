import React, { useMemo, useState } from 'react';
import { OrderDto, OrderStatus } from '../../services/orderApi';
import { ProductItem } from '../../types/farm.types';
import {
  buildRealProductBreakdown,
  buildRealSalesChart,
  ChartRange,
  formatCompactVnd,
} from './adminAnalytics';
import { AdminViewId } from './AdminSidebar';

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao hàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

function getDefaultDates() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  return {
    firstOfMonth: `${y}-${m}-01`,
    today: `${y}-${m}-${d}`,
  };
}

interface AdminOverviewTabProps {
  orders: OrderDto[];
  products: ProductItem[];
  onUpdateStatus: (orderId: number, status: OrderStatus) => Promise<void>;
  onSelectView: (view: AdminViewId) => void;
}

/**
 * Trang Dashboard Tổng quan — Biểu diễn 100% số liệu thật từ bảng orders & products trên Supabase
 */
export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  orders,
  products,
  onUpdateStatus,
  onSelectView,
}) => {
  const defaults = useMemo(getDefaultDates, []);
  const [range, setRange] = useState<ChartRange>('day');
  const [fromDate, setFromDate] = useState<string>(defaults.firstOfMonth);
  const [toDate, setToDate] = useState<string>(defaults.today);
  const [breakdownMode, setBreakdownMode] = useState<'product' | 'category'>('product');

  const chartData = useMemo(
    () => buildRealSalesChart({ orders, range, fromDate, toDate }),
    [orders, range, fromDate, toDate]
  );

  const breakdownRows = useMemo(
    () => buildRealProductBreakdown({ orders, products, mode: breakdownMode }),
    [orders, products, breakdownMode]
  );

  const recentOrders = orders.slice(0, 5);

  return (
    <>
      <div className="htf-adm-overview-grid">
        {/* Cột trái: Biểu đồ Sales Overview thực tế */}
        <section className="htf-adm-card">
          <div className="htf-adm-card__head">
            <div>
              <h2 className="htf-adm-card__title">Sales Overview · Doanh thu thực tế</h2>
              <small style={{ color: '#7e8299', fontSize: 12 }}>
                Tổng trong kỳ đang xem:{' '}
                <strong style={{ color: '#4466f2' }}>
                  {chartData.periodRevenueVnd.toLocaleString('vi-VN')}đ
                </strong>{' '}
                ({chartData.periodOrdersCount} đơn hợp lệ)
              </small>
            </div>
            <span className="htf-adm-card__collapse">«</span>
          </div>

          <div className="htf-adm-chart-toolbar">
            <div className="htf-adm-range-tabs">
              <button
                type="button"
                className={range === 'hours' ? 'is-active' : ''}
                onClick={() => setRange('hours')}
              >
                Hours
              </button>
              <button
                type="button"
                className={range === 'day' ? 'is-active' : ''}
                onClick={() => setRange('day')}
              >
                Day
              </button>
              <button
                type="button"
                className={range === 'week' ? 'is-active' : ''}
                onClick={() => setRange('week')}
              >
                Week
              </button>
              <button
                type="button"
                className={range === 'month' ? 'is-active' : ''}
                onClick={() => setRange('month')}
              >
                Month
              </button>
            </div>

            <div className="htf-adm-date-pills">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="htf-adm-date-input"
                title="Từ ngày"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="htf-adm-date-input"
                title="Đến ngày"
              />
            </div>
          </div>

          <div className="htf-adm-chart-legend">
            <i /> Doanh thu thực tế (VNĐ)
          </div>

          <div className="htf-adm-barchart">
            <div className="htf-adm-barchart__yaxis">
              {chartData.yTicks.map((tick, idx) => (
                <span key={idx}>{tick}</span>
              ))}
            </div>

            <div className="htf-adm-barchart__plot">
              {chartData.bars.map((bar) => (
                <div
                  key={bar.label}
                  className="htf-adm-bar-col"
                  title={`${bar.label}: ${bar.revenueVnd.toLocaleString('vi-VN')}đ (${bar.orderCount} đơn)`}
                >
                  {bar.revenueVnd > 0 && (
                    <span className="htf-adm-bar-col__val">
                      {formatCompactVnd(bar.revenueVnd)}
                    </span>
                  )}
                  <div
                    className={`htf-adm-bar-col__stick ${bar.revenueVnd === 0 ? 'is-zero' : ''}`}
                    style={{ height: bar.revenueVnd > 0 ? `${bar.heightPct}%` : '4px' }}
                  />
                  <span className="htf-adm-bar-col__label">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cột phải: Sales By Category / Product thực tế */}
        <section className="htf-adm-card">
          <div className="htf-adm-card__head">
            <h2 className="htf-adm-card__title">Sales By Category</h2>
            <div className="htf-adm-range-tabs">
              <button
                type="button"
                className={breakdownMode === 'product' ? 'is-active' : ''}
                onClick={() => setBreakdownMode('product')}
              >
                Sản phẩm
              </button>
              <button
                type="button"
                className={breakdownMode === 'category' ? 'is-active' : ''}
                onClick={() => setBreakdownMode('category')}
              >
                Danh mục
              </button>
            </div>
          </div>

          <div className="htf-adm-catlist">
            {breakdownRows.map((row) => (
              <div key={row.id} className="htf-adm-catitem">
                <img
                  src={row.image}
                  alt={row.name}
                  className="htf-adm-catitem__thumb"
                />
                <div className="htf-adm-catitem__info">
                  <span className="htf-adm-catitem__sub">{row.category}</span>
                  <strong className="htf-adm-catitem__name">{row.name}</strong>
                </div>
                <span
                  className={`htf-adm-catitem__qty ${row.isTop ? 'is-top' : ''}`}
                  title="Số lượng phần đã bán thực tế"
                >
                  {row.soldQty} phần
                </span>
                <span className="htf-adm-catitem__pct">{row.sharePct}%</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bảng Đơn hàng mới nhất ngay dưới Tổng quan */}
      <section className="htf-admin__panel">
        <div className="htf-admin__panel-head">
          <h2>Đơn đặt hàng gần đây ({orders.length})</h2>
          <button
            type="button"
            className="htf-admin__btn-sm"
            onClick={() => onSelectView('orders')}
          >
            Xem toàn bộ đơn hàng →
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="htf-admin__empty">Chưa có đơn đặt hàng nào trên hệ thống.</p>
        ) : (
          <div className="htf-admin__table-wrap">
            <table className="htf-admin__table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Tổng thanh toán</th>
                  <th>Trạng thái (Gửi mail tự động)</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.order_code}</strong>
                    </td>
                    <td>
                      <div>{order.customer_name}</div>
                      <small>{order.customer_phone}</small>
                      {order.customer_email && (
                        <div className="htf-admin__note">✉️ {order.customer_email}</div>
                      )}
                    </td>
                    <td>
                      {order.product_name} × <strong>{order.quantity}</strong>
                    </td>
                    <td>
                      <strong>{order.total_price_vnd.toLocaleString('vi-VN')}đ</strong>
                    </td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          onUpdateStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="htf-admin__select"
                      >
                        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((st) => (
                          <option key={st} value={st}>
                            {STATUS_LABELS[st]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};
