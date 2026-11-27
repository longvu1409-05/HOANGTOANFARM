import React from 'react';
import { AdminViewId } from './AdminSidebar';

interface AdminTopbarProps {
  username: string;
  categoriesCount: number;
  productsCount: number;
  pendingOrdersCount: number;
  unreadNotifications: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onToggleSidebar: () => void;
  onSelectView: (view: AdminViewId) => void;
  onLogout: () => void;
}

/**
 * Thanh Topbar nổi màu trắng phía trên: Nút thu gọn Sidebar, Phóng toàn màn hình,
 * Bộ 3 thẻ đếm nhanh (Category / Status / Order), Tìm kiếm xanh và Hồ sơ Admin
 */
export const AdminTopbar: React.FC<AdminTopbarProps> = ({
  username,
  categoriesCount,
  productsCount,
  pendingOrdersCount,
  unreadNotifications,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onToggleSidebar,
  onSelectView,
  onLogout,
}) => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => undefined);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
    }
  };

  return (
    <header className="htf-adm-topbar">
      <div className="htf-adm-topbar__left">
        <button
          type="button"
          className="htf-adm-icon-btn"
          onClick={onToggleSidebar}
          title="Thu gọn / Mở rộng menu bên trái"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="6" width="20" height="12" rx="6" />
            <circle cx="8" cy="12" r="3" fill="currentColor" />
          </svg>
        </button>

        <button
          type="button"
          className="htf-adm-icon-btn"
          onClick={toggleFullscreen}
          title="Toàn màn hình"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>

        <div className="htf-adm-quick-pills">
          <button
            type="button"
            className="htf-adm-quick-pill"
            onClick={() => onSelectView('products')}
          >
            <span>Category</span>
            <span className="htf-adm-quick-pill__count">{categoriesCount}</span>
            <span>▾</span>
          </button>

          <button
            type="button"
            className="htf-adm-quick-pill"
            onClick={() => onSelectView('products')}
          >
            <span>Products</span>
            <span className="htf-adm-quick-pill__count">{productsCount}</span>
            <span>▾</span>
          </button>

          <button
            type="button"
            className="htf-adm-quick-pill"
            onClick={() => onSelectView('orders')}
          >
            <span>Order</span>
            <span className="htf-adm-quick-pill__count">{pendingOrdersCount}</span>
            <span>▾</span>
          </button>
        </div>
      </div>

      <div className="htf-adm-topbar__right">
        <form
          className="htf-adm-search"
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit();
          }}
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm SĐT, mã đơn, sản phẩm..."
          />
          <button type="submit" className="htf-adm-search__btn" aria-label="Tìm kiếm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>

        <div className="htf-adm-profile">
          <div className="htf-adm-profile__avatar">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div className="htf-adm-profile__info">
            <strong>{username}</strong>
            <span>Admin</span>
          </div>
        </div>

        <button
          type="button"
          className="htf-adm-icon-btn htf-adm-bell"
          onClick={() => onSelectView('contacts')}
          title="Thông báo đơn chờ & liên hệ mới"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadNotifications > 0 && (
            <span className="htf-adm-bell__dot">{unreadNotifications}</span>
          )}
        </button>

        <a href="./" className="htf-adm-icon-btn" title="Về trang chủ bán hàng">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </a>

        <button
          type="button"
          className="htf-adm-icon-btn"
          onClick={onLogout}
          title="Đăng xuất Quản trị"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
};
