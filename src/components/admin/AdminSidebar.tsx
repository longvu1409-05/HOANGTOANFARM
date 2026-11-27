import React from 'react';

export type AdminViewId = 'overview' | 'orders' | 'products' | 'contacts' | 'marketing';

interface AdminSidebarProps {
  activeView: AdminViewId;
  onSelectView: (view: AdminViewId) => void;
  pendingOrdersCount: number;
  productsCount: number;
  unreadContactsCount: number;
  subscribersCount: number;
  onLogout: () => void;
}

/**
 * Thanh điều hướng dọc màu tối (#1e1e2d) phong cách Creative Multipurpose Admin
 */
export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeView,
  onSelectView,
  pendingOrdersCount,
  productsCount,
  unreadContactsCount,
  subscribersCount,
  onLogout,
}) => {
  return (
    <aside className="htf-adm-sidebar" aria-label="Menu quản trị">
      <div className="htf-adm-brand">
        <div className="htf-adm-brand__ring">
          <div className="htf-adm-brand__ring-inner">HT</div>
        </div>
        <div className="htf-adm-brand__text">
          <strong>HOÀNG TOÀN</strong>
          <span>Multipurpose Admin</span>
        </div>
      </div>

      <nav className="htf-adm-nav">
        <span className="htf-adm-nav__section">Tổng quan E-Shop</span>

        <button
          type="button"
          className={`htf-adm-nav__item ${activeView === 'overview' ? 'is-active' : ''}`}
          onClick={() => onSelectView('overview')}
        >
          <span className="htf-adm-nav__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span className="htf-adm-nav__label">Dashboard</span>
          <span className="htf-adm-nav__badge htf-adm-nav__badge--blue">4</span>
          <span className="htf-adm-nav__arrow">›</span>
        </button>

        <span className="htf-adm-nav__section">Quản lý Cửa hàng</span>

        <button
          type="button"
          className={`htf-adm-nav__item ${activeView === 'orders' ? 'is-active' : ''}`}
          onClick={() => onSelectView('orders')}
        >
          <span className="htf-adm-nav__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </span>
          <span className="htf-adm-nav__label">Đơn đặt hàng</span>
          {pendingOrdersCount > 0 && (
            <span className="htf-adm-nav__badge htf-adm-nav__badge--blue">
              {pendingOrdersCount}
            </span>
          )}
          <span className="htf-adm-nav__arrow">›</span>
        </button>

        <button
          type="button"
          className={`htf-adm-nav__item ${activeView === 'products' ? 'is-active' : ''}`}
          onClick={() => onSelectView('products')}
        >
          <span className="htf-adm-nav__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </span>
          <span className="htf-adm-nav__label">Kho Sản phẩm</span>
          <span className="htf-adm-nav__badge htf-adm-nav__badge--green">+{productsCount}</span>
          <span className="htf-adm-nav__arrow">›</span>
        </button>

        <button
          type="button"
          className={`htf-adm-nav__item ${activeView === 'contacts' ? 'is-active' : ''}`}
          onClick={() => onSelectView('contacts')}
        >
          <span className="htf-adm-nav__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>
          <span className="htf-adm-nav__label">Liên hệ &amp; Đánh giá</span>
          {unreadContactsCount > 0 ? (
            <span className="htf-adm-nav__badge htf-adm-nav__badge--pink">Hot</span>
          ) : (
            <span className="htf-adm-nav__arrow">›</span>
          )}
        </button>

        <button
          type="button"
          className={`htf-adm-nav__item ${activeView === 'marketing' ? 'is-active' : ''}`}
          onClick={() => onSelectView('marketing')}
        >
          <span className="htf-adm-nav__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </span>
          <span className="htf-adm-nav__label">Bài viết &amp; Bản tin</span>
          {subscribersCount > 0 && (
            <span className="htf-adm-nav__badge htf-adm-nav__badge--blue">
              {subscribersCount}
            </span>
          )}
          <span className="htf-adm-nav__arrow">›</span>
        </button>

        <span className="htf-adm-nav__section">Hệ thống</span>

        <a href="./" className="htf-adm-nav__item">
          <span className="htf-adm-nav__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
          <span className="htf-adm-nav__label">Xem Trang Cửa hàng</span>
          <span className="htf-adm-nav__arrow">›</span>
        </a>

        <a
          href="/api/health"
          target="_blank"
          rel="noreferrer"
          className="htf-adm-nav__item"
        >
          <span className="htf-adm-nav__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </span>
          <span className="htf-adm-nav__label">Trạng thái Supabase</span>
          <span className="htf-adm-nav__arrow">›</span>
        </a>

        <button type="button" className="htf-adm-nav__item" onClick={onLogout}>
          <span className="htf-adm-nav__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span className="htf-adm-nav__label">Đăng xuất</span>
        </button>
      </nav>
    </aside>
  );
};
