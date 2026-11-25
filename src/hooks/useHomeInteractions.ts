import { useState } from 'react';
import { ProductItem, ProcessStep, PressVideoItem } from '../types/farm.types';

/**
 * Custom Hook quản lý toàn bộ trạng thái tương tác trên trang chủ
 * (giỏ hàng, mở popup đặt quà, xem chi tiết quy trình/video, hiện thông báo)
 */
export function useHomeInteractions() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [activeStep, setActiveStep] = useState<ProcessStep | null>(null);
  const [activeVideo, setActiveVideo] = useState<PressVideoItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
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

  const confirmOrder = (productName: string, customerName: string) => {
    setCartCount((count) => count + 1);
    setOrderModalOpen(false);
    setSelectedProduct(null);
    showToast(`Cảm ơn ${customerName}! Đã ghi nhận đơn "${productName}".`);
  };

  const closeInfoModal = () => {
    setActiveStep(null);
    setActiveVideo(null);
  };

  const subscribeNewsletter = (email: string) => {
    showToast(`Đã đăng ký nhận ưu đãi thành công cho ${email}!`);
  };

  return {
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
