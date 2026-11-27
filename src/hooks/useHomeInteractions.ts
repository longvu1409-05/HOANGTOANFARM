import { useEffect, useState } from 'react';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/productsData';
import { createOrder, CreateOrderPayload } from '../services/orderApi';
import { subscribeNewsletterEmail } from '../services/newsletterApi';
import { fetchProducts } from '../services/productApi';
import { ProductItem, ProcessStep, PressVideoItem } from '../types/farm.types';

/**
 * Custom Hook quản lý trạng thái tương tác & kết nối API Backend trên trang chủ
 */
export function useHomeInteractions() {
  const [products, setProducts] = useState<ProductItem[]>(FALLBACK_PRODUCTS);
  const [cartCount, setCartCount] = useState<number>(0);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [activeStep, setActiveStep] = useState<ProcessStep | null>(null);
  const [activeVideo, setActiveVideo] = useState<PressVideoItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => {
        if (active && list.length > 0) {
          setProducts(list);
        }
      })
      .catch(() => {
        // Giữ dữ liệu tĩnh mặc định nếu Backend chưa bật
      });
    return () => {
      active = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const openGeneralOrderModal = () => {
    setSelectedProduct(null);
    setOrderModalOpen(true);
  };

  const openProductOrderModal = (product: ProductItem) => {
    setSelectedProduct(product);
    setOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setOrderModalOpen(false);
  };

  const confirmOrder = async (payload: CreateOrderPayload) => {
    const res = await createOrder(payload);
    setCartCount((count) => count + payload.quantity);
    setOrderModalOpen(false);
    setSelectedProduct(null);
    showToast(
      res.message ||
        `Cảm ơn ${payload.customerName}! Mã đơn ${res.data.order_code} đã được ghi nhận.`
    );
  };

  const closeInfoModal = () => {
    setActiveStep(null);
    setActiveVideo(null);
  };

  const subscribeNewsletter = async (email: string) => {
    try {
      const res = await subscribeNewsletterEmail(email);
      showToast(res.message || `Đã đăng ký nhận ưu đãi thành công cho ${email}!`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể đăng ký lúc này.';
      showToast(message);
    }
  };

  return {
    products,
    cartCount,
    orderModalOpen,
    selectedProduct,
    activeStep,
    activeVideo,
    toastMessage,
    openGeneralOrderModal,
    openProductOrderModal,
    closeOrderModal,
    confirmOrder,
    setActiveStep,
    setActiveVideo,
    closeInfoModal,
    subscribeNewsletter,
  };
}
