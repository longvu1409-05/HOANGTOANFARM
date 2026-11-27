import React, { useCallback, useEffect, useState } from 'react';
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
import { AdminMarketingTab } from './AdminMarketingTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminProductsTab } from './AdminProductsTab';
import './AdminDashboard.css';

type AdminTab = 'orders' | 'products' | 'contacts' | 'marketing';

/**
 * Trang Quản trị Toàn diện Hoàng Toàn Farm (?admin=1):
 * Quản lý Đơn hàng, Sản phẩm (Thêm/Sửa/Xóa), Liên hệ/Đánh giá, Email & Bài viết
 */
export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
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
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice((c) => (c === msg ? null : c)), 3500);
  };

  const loadAll = useCallback(async (orderFilters?: { phone?: string; status?: string }) => {
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
      setErrorMsg(
        err instanceof Error ? err.message : 'Không kết nối được Backend API (cổng 4000).'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleOrderStatus = async (orderId: number, status: OrderStatus) => {
    await updateOrderStatus(orderId, status);
    showNotice('Đã cập nhật trạng thái đơn hàng.');
    await loadAll();
  };

  return (
    <div className="htf-admin">
      <div className="htf-admin__container">
        <header className="htf-admin__header">
          <div>
            <h1 className="htf-admin__title">Quản trị Hoàng Toàn Farm</h1>
            <p className="htf-admin__sub">
              Quản lý toàn bộ Sản phẩm (CRUD), Đơn đặt hàng, Liên hệ &amp; Bản tin
            </p>
          </div>
          <a href="./" className="htf-admin__back-btn">
            ← Về trang chủ
          </a>
        </header>

        {errorMsg && <div className="htf-admin__error">{errorMsg}</div>}
        {notice && <div className="htf-admin__notice">{notice}</div>}

        <div className="htf-admin__stats">
          <div className="htf-admin__stat-card">
            <span>Sản phẩm đang bán</span>
            <strong>{products.length}</strong>
          </div>
          <div className="htf-admin__stat-card">
            <span>Tổng đơn hàng ({summary.pendingOrders} chờ)</span>
            <strong>{summary.totalOrders}</strong>
          </div>
          <div className="htf-admin__stat-card">
            <span>Doanh thu tạm tính</span>
            <strong>{summary.totalRevenueVnd.toLocaleString('vi-VN')}đ</strong>
          </div>
          <div className="htf-admin__stat-card">
            <span>Liên hệ / Email tin</span>
            <strong>
              {contacts.length} / {subscribers.length}
            </strong>
          </div>
        </div>

        <nav className="htf-admin__tabs" aria-label="Phân mục quản trị">
          <button
            type="button"
            className={activeTab === 'orders' ? 'is-active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Đơn hàng ({orders.length})
          </button>
          <button
            type="button"
            className={activeTab === 'products' ? 'is-active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Sản phẩm ({products.length})
          </button>
          <button
            type="button"
            className={activeTab === 'contacts' ? 'is-active' : ''}
            onClick={() => setActiveTab('contacts')}
          >
            Liên hệ &amp; Đánh giá ({contacts.length})
          </button>
          <button
            type="button"
            className={activeTab === 'marketing' ? 'is-active' : ''}
            onClick={() => setActiveTab('marketing')}
          >
            Bản tin &amp; Bài viết ({subscribers.length})
          </button>
        </nav>

        {loading && orders.length === 0 && products.length === 0 ? (
          <section className="htf-admin__panel">
            <p className="htf-admin__empty">Đang tải dữ liệu hệ thống...</p>
          </section>
        ) : (
          <>
            {activeTab === 'orders' && (
              <AdminOrdersTab
                orders={orders}
                onFilter={(filters) => loadAll(filters)}
                onUpdateStatus={handleOrderStatus}
              />
            )}
            {activeTab === 'products' && (
              <AdminProductsTab
                products={products}
                onReload={() => loadAll()}
                onNotify={showNotice}
              />
            )}
            {activeTab === 'contacts' && (
              <AdminContactsTab
                contacts={contacts}
                reviews={reviews}
                onReload={() => loadAll()}
                onNotify={showNotice}
              />
            )}
            {activeTab === 'marketing' && (
              <AdminMarketingTab
                subscribers={subscribers}
                articles={articles}
                onReload={() => loadAll()}
                onNotify={showNotice}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
