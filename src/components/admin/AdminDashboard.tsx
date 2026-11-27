import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ApiHttpError } from '../../services/apiClient';
import {
  AdminSessionDto,
  clearStoredAdminToken,
  verifyAdminSession,
} from '../../services/authApi';
import { ContactDto, fetchContacts } from '../../services/contactApi';
import {
  fetchKnowledgeArticles,
  fetchReviews,
  KnowledgeArticleDto,
  ReviewDto,
} from '../../services/contentApi';
import { fetchSubscribers, SubscriberDto } from '../../services/newsletterApi';
import {
  fetchOrders,
  OrderDto,
  OrderStatus,
  updateOrderStatus,
} from '../../services/orderApi';
import { fetchProducts } from '../../services/productApi';
import { ProductItem } from '../../types/farm.types';
import { AdminContactsTab } from './AdminContactsTab';
import { AdminKpiCards } from './AdminKpiCards';
import { AdminLoginCard } from './AdminLoginCard';
import { AdminMarketingTab } from './AdminMarketingTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminSidebar, AdminViewId } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import './AdminLayout.css';
import './AdminWidgets.css';

const VIEW_TITLES: Record<AdminViewId, { title: string; crumb: string }> = {
  overview: { title: 'E Shop · Hoàng Toàn Farm', crumb: 'Default' },
  orders: { title: 'Quản lý Đơn đặt hàng', crumb: 'Orders' },
  products: { title: 'Kho Sản phẩm & Giá bán', crumb: 'Products' },
  contacts: { title: 'Liên hệ & Đánh giá', crumb: 'CRM & Reviews' },
  marketing: { title: 'Bản tin & Kiến thức', crumb: 'Marketing' },
};

/**
 * Hệ thống Quản trị Chuyên nghiệp Hoàng Toàn E-Shop (?admin=1)
 */
export const AdminDashboard: React.FC = () => {
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [session, setSession] = useState<AdminSessionDto | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<AdminViewId>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenueVnd: 0,
    pendingOrders: 0,
  });
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [contacts, setContacts] = useState<ContactDto[]>([]);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberDto[]>([]);
  const [articles, setArticles] = useState<KnowledgeArticleDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice((c) => (c === msg ? null : c)), 3800);
  };

  useEffect(() => {
    verifyAdminSession().then((valid) => {
      setSession(valid);
      setAuthChecking(false);
    });
  }, []);

  const handleLogout = () => {
    clearStoredAdminToken();
    setSession(null);
  };

  const loadAll = useCallback(async (orderFilters?: { phone?: string; code?: string; status?: string }) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [orderData, prodList, subList, contactList, reviewList, artList] = await Promise.all([
        fetchOrders(orderFilters),
        fetchProducts(),
        fetchSubscribers(),
        fetchContacts(),
        fetchReviews(),
        fetchKnowledgeArticles(),
      ]);
      setOrders(orderData.orders);
      setSummary(orderData.summary);
      setProducts(prodList);
      setSubscribers(subList);
      setContacts(contactList);
      setReviews(reviewList);
      setArticles(artList);
    } catch (err) {
      if (err instanceof ApiHttpError && err.status === 401) {
        clearStoredAdminToken();
        setSession(null);
        return;
      }
      setErrorMsg(err instanceof Error ? err.message : 'Không tải được dữ liệu từ Supabase.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) {
      loadAll();
    }
  }, [session, loadAll]);

  const handleOrderStatus = async (orderId: number, status: OrderStatus) => {
    const res = await updateOrderStatus(orderId, status);
    showNotice(res.message || 'Đã cập nhật trạng thái đơn hàng.');
    await loadAll();
  };

  const handleGlobalSearch = () => {
    const q = searchQuery.trim();
    setActiveView('orders');
    if (!q) {
      loadAll();
      return;
    }
    const isCode = q.toUpperCase().startsWith('HTF-');
    loadAll(isCode ? { code: q } : { phone: q });
  };

  const derivedStats = useMemo(() => {
    const categoriesCount = new Set(products.map((p) => p.category || 'Trái cây tươi')).size || 3;
    const totalStockUnits = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);
    const unreadContacts = contacts.filter((c) => c.status === 'new').length;
    const uniquePhones = new Set(orders.map((o) => o.customer_phone)).size;
    const totalCustomersReach = uniquePhones + subscribers.length + contacts.length + reviews.length;

    return {
      categoriesCount,
      totalStockUnits,
      unreadContacts,
      totalCustomersReach,
      unreadNotifications: summary.pendingOrders + unreadContacts,
    };
  }, [products, contacts, orders, subscribers, reviews, summary.pendingOrders]);

  if (authChecking) {
    return (
      <div className="htf-adm-login-page">
        <p style={{ color: '#cbd5e1', fontSize: 15 }}>Đang khởi tạo hệ thống Quản trị...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLoginCard onLoginSuccess={(newSession) => setSession(newSession)} />;
  }

  const meta = VIEW_TITLES[activeView];

  return (
    <div className={`htf-adm-shell ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
      <AdminSidebar
        activeView={activeView}
        onSelectView={setActiveView}
        pendingOrdersCount={summary.pendingOrders}
        productsCount={products.length}
        unreadContactsCount={derivedStats.unreadContacts}
        subscribersCount={subscribers.length}
        onLogout={handleLogout}
      />

      <main className="htf-adm-main">
        <AdminTopbar
          username={session.username}
          categoriesCount={derivedStats.categoriesCount}
          productsCount={products.length}
          pendingOrdersCount={summary.pendingOrders}
          unreadNotifications={derivedStats.unreadNotifications}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchSubmit={handleGlobalSearch}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          onSelectView={setActiveView}
          onLogout={handleLogout}
        />

        {/* Dòng Tiêu đề trang + Breadcrumb + Hộp 4 nút công cụ góc phải */}
        <div className="htf-adm-pagehead">
          <div>
            <h1 className="htf-adm-pagehead__title">{meta.title}</h1>
            <div className="htf-adm-breadcrumb">
              Home / <strong>Dashboard</strong> / {meta.crumb}
            </div>
          </div>

          <div className="htf-adm-quickbox">
            <button
              type="button"
              onClick={() => setActiveView('marketing')}
              title="Bản tin Email & Bài viết"
            >
              ✉
            </button>
            <button
              type="button"
              onClick={() => setActiveView('contacts')}
              title="Tin nhắn liên hệ khách hàng"
            >
              💬
            </button>
            <button
              type="button"
              onClick={() => loadAll()}
              title="Làm mới dữ liệu trực tiếp"
            >
              ↻
            </button>
            <button
              type="button"
              className="is-primary"
              onClick={() => setActiveView('products')}
              title="Thêm / Quản lý sản phẩm"
            >
              ★
            </button>
          </div>
        </div>

        {errorMsg && <div className="htf-admin__error">{errorMsg}</div>}
        {notice && <div className="htf-admin__notice">{notice}</div>}

        {/* 4 thẻ KPI luôn hiển thị nổi bật */}
        <AdminKpiCards
          totalRevenueVnd={summary.totalRevenueVnd}
          totalOrders={summary.totalOrders}
          pendingOrders={summary.pendingOrders}
          productsCount={products.length}
          totalStockUnits={derivedStats.totalStockUnits}
          totalCustomersReach={derivedStats.totalCustomersReach}
        />

        {loading && orders.length === 0 && products.length === 0 ? (
          <section className="htf-admin__panel">
            <p className="htf-admin__empty">Đang đồng bộ dữ liệu trực tiếp từ Supabase...</p>
          </section>
        ) : (
          <>
            {activeView === 'overview' && (
              <AdminOverviewTab
                orders={orders}
                products={products}
                onUpdateStatus={handleOrderStatus}
                onSelectView={setActiveView}
              />
            )}
            {activeView === 'orders' && (
              <AdminOrdersTab
                orders={orders}
                onFilter={(filters) => loadAll(filters)}
                onUpdateStatus={handleOrderStatus}
              />
            )}
            {activeView === 'products' && (
              <AdminProductsTab
                products={products}
                onReload={() => loadAll()}
                onNotify={showNotice}
              />
            )}
            {activeView === 'contacts' && (
              <AdminContactsTab
                contacts={contacts}
                reviews={reviews}
                onReload={() => loadAll()}
                onNotify={showNotice}
              />
            )}
            {activeView === 'marketing' && (
              <AdminMarketingTab
                subscribers={subscribers}
                articles={articles}
                onReload={() => loadAll()}
                onNotify={showNotice}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};
