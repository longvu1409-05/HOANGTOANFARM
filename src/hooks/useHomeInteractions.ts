import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_KNOWLEDGE_DTOS } from '../data/knowledgeData';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/productsData';
import { DEFAULT_REVIEW_DTOS } from '../data/trustData';
import { createReview, fetchKnowledgeArticles, fetchReviews, KnowledgeArticleDto, ReviewDto } from '../services/contentApi';
import { submitContact } from '../services/contactApi';
import { createOrder, CreateOrderPayload } from '../services/orderApi';
import { subscribeNewsletterEmail } from '../services/newsletterApi';
import { fetchProducts } from '../services/productApi';
import { CartItem, PressVideoItem, ProcessStep, ProductItem } from '../types/farm.types';

const CART_STORAGE_KEY = 'htf_cart_items_v1';

function loadInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Custom Hook quản lý toàn bộ trạng thái & gọi API Backend trên trang chủ Hoàng Toàn Farm
 */
export function useHomeInteractions() {
  const [products, setProducts] = useState<ProductItem[]>(FALLBACK_PRODUCTS);
  const [knowledgeList, setKnowledgeList] =
    useState<KnowledgeArticleDto[]>(DEFAULT_KNOWLEDGE_DTOS);
  const [reviews, setReviews] = useState<ReviewDto[]>(DEFAULT_REVIEW_DTOS);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadInitialCart);

  // Các modal / drawer đang mở
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [orderLookupOpen, setOrderLookupOpen] = useState<boolean>(false);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);
  const [reviewModalOpen, setReviewModalOpen] = useState<boolean>(false);
  const [storyModalOpen, setStoryModalOpen] = useState<boolean>(false);

  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [detailProduct, setDetailProduct] = useState<ProductItem | null>(null);
  const [activeStep, setActiveStep] = useState<ProcessStep | null>(null);
  const [activeVideo, setActiveVideo] = useState<PressVideoItem | null>(null);
  const [activeArticle, setActiveArticle] = useState<KnowledgeArticleDto | null>(null);
  const [knowledgeListOpen, setKnowledgeListOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4200);
  }, []);

  const refreshCatalog = useCallback(async () => {
    try {
      const [prodList, artList, revList] = await Promise.all([
        fetchProducts(),
        fetchKnowledgeArticles(),
        fetchReviews(),
      ]);
      if (prodList.length > 0) setProducts(prodList);
      if (artList.length > 0) setKnowledgeList(artList);
      if (revList.length > 0) setReviews(revList);
    } catch {
      // Giữ fallback tĩnh nếu server tạm tắt
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: ProductItem, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(50, i.quantity + quantity) }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Đã thêm ${quantity} × "${product.name}" vào giỏ hàng.`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: Math.min(50, quantity) } : i
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const checkoutOrder = async (payload: CreateOrderPayload, clearCartAfter = false) => {
    const res = await createOrder(payload);
    if (clearCartAfter) {
      setCartItems([]);
      setCartOpen(false);
    }
    setOrderModalOpen(false);
    setSelectedProduct(null);
    await refreshCatalog();
    showToast(
      res.message ||
        `Đặt thành công! Mã đơn ${res.data.order_code} (${res.data.totalPriceLabel ?? ''}).`
    );
    return res.data;
  };

  const openGeneralOrderModal = () => {
    setSelectedProduct(null);
    setOrderModalOpen(true);
  };

  const openProductOrderModal = (product: ProductItem) => {
    setSelectedProduct(product);
    setOrderModalOpen(true);
  };

  const openKnowledgeByIdOrTitle = (idOrTitle: string) => {
    const found = knowledgeList.find(
      (a) => a.id === idOrTitle || a.title.toLowerCase() === idOrTitle.toLowerCase()
    );
    if (found) {
      setActiveArticle(found);
      setKnowledgeListOpen(false);
    } else {
      setKnowledgeListOpen(true);
    }
  };

  const subscribeNewsletter = async (email: string) => {
    try {
      const res = await subscribeNewsletterEmail(email);
      showToast(res.message || `Đã đăng ký nhận ưu đãi thành công cho ${email}!`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Không thể đăng ký lúc này.');
    }
  };

  const sendContact = async (payload: Parameters<typeof submitContact>[0]) => {
    const res = await submitContact(payload);
    setContactModalOpen(false);
    showToast(res.message || 'Đã gửi yêu cầu liên hệ thành công!');
  };

  const sendReview = async (payload: { author: string; quote: string; rating: number }) => {
    const res = await createReview(payload);
    setReviewModalOpen(false);
    await refreshCatalog();
    showToast(res.message || 'Cảm ơn bạn đã gửi đánh giá!');
  };

  return {
    products,
    knowledgeList,
    reviews,
    cartItems,
    cartCount,
    cartOpen,
    setCartOpen,
    orderModalOpen,
    setOrderModalOpen,
    orderLookupOpen,
    setOrderLookupOpen,
    contactModalOpen,
    setContactModalOpen,
    reviewModalOpen,
    setReviewModalOpen,
    storyModalOpen,
    setStoryModalOpen,
    selectedProduct,
    detailProduct,
    setDetailProduct,
    activeStep,
    setActiveStep,
    activeVideo,
    setActiveVideo,
    activeArticle,
    setActiveArticle,
    knowledgeListOpen,
    setKnowledgeListOpen,
    toastMessage,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    checkoutOrder,
    openGeneralOrderModal,
    openProductOrderModal,
    openKnowledgeByIdOrTitle,
    subscribeNewsletter,
    sendContact,
    sendReview,
  };
}
