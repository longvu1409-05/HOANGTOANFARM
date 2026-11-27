import React from 'react';
import { Header } from '../components/layout/Header/Header';
import { FooterSection } from '../components/layout/Footer/FooterSection';
import { HeroSection } from '../components/sections/Hero/HeroSection';
import { FeaturedProductsSection } from '../components/sections/Products/FeaturedProductsSection';
import { BrandStoryBanner } from '../components/sections/BrandStory/BrandStoryBanner';
import { GrowingProcessSection } from '../components/sections/Process/GrowingProcessSection';
import { CommitmentsTestimonialsSection } from '../components/sections/Trust/CommitmentsTestimonialsSection';
import { PressMediaSection } from '../components/sections/Press/PressMediaSection';
import { SelectionKnowledgeSection } from '../components/sections/Knowledge/SelectionKnowledgeSection';
import { PartnersSection } from '../components/sections/Partners/PartnersSection';
import { OrderModal } from '../components/modals/OrderModal';
import { ProductDetailModal } from '../components/modals/ProductDetailModal';
import { CartDrawer } from '../components/modals/CartDrawer';
import { OrderLookupModal } from '../components/modals/OrderLookupModal';
import { ContactModal } from '../components/modals/ContactModal';
import { KnowledgeModal } from '../components/modals/KnowledgeModal';
import { ReviewModal } from '../components/modals/ReviewModal';
import { StoryModal } from '../components/modals/StoryModal';
import { InfoModal } from '../components/modals/InfoModal';
import { ToastNotification } from '../components/modals/ToastNotification';
import { useHomeInteractions } from '../hooks/useHomeInteractions';

/**
 * Trang chủ Hoàng Toàn Farm — sắp xếp các phân khu theo đúng thứ tự thiết kế Figma,
 * tích hợp đầy đủ tính năng Giỏ hàng, Chi tiết sản phẩm, Tra đơn hàng, Kiến thức, Đánh giá & Liên hệ.
 */
export const HomePage: React.FC = () => {
  const {
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
  } = useHomeInteractions();

  return (
    <div className="htf-page" data-node-id="675:126" data-name="Desktop - 3">
      {/* 1. Đầu trang */}
      <Header
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onSelectProduct={setDetailProduct}
      />

      {/* 2. Nội dung chính theo thứ tự thiết kế */}
      <main>
        <HeroSection onOpenOrderModal={openGeneralOrderModal} />
        <FeaturedProductsSection
          products={products}
          onSelectProduct={openProductOrderModal}
          onInspectProduct={setDetailProduct}
        />
        <BrandStoryBanner onOpenStory={() => setStoryModalOpen(true)} />
        <GrowingProcessSection onSelectStep={setActiveStep} />
        <CommitmentsTestimonialsSection
          reviews={reviews}
          onOpenReviewModal={() => setReviewModalOpen(true)}
        />
        <PressMediaSection onSelectVideo={setActiveVideo} />
        <SelectionKnowledgeSection
          onReadArticle={openKnowledgeByIdOrTitle}
          onOpenAllKnowledge={() => {
            setActiveArticle(null);
            setKnowledgeListOpen(true);
          }}
        />
        <PartnersSection />
      </main>

      {/* 3. Cuối trang */}
      <FooterSection
        onOpenOrderModal={openGeneralOrderModal}
        onSubscribed={subscribeNewsletter}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenOrderLookup={() => setOrderLookupOpen(true)}
        onOpenStory={() => setStoryModalOpen(true)}
      />

      {/* 4. Các hộp thoại tương tác & Ngăn kéo Giỏ hàng */}
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateCartQuantity}
          onRemoveItem={removeFromCart}
          onCheckout={async (payload) => {
            await checkoutOrder(payload, true);
          }}
          onOpenOrderLookup={() => setOrderLookupOpen(true)}
        />
      )}

      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={addToCart}
          onOrderNow={openProductOrderModal}
        />
      )}

      {orderModalOpen && (
        <OrderModal
          products={products}
          selectedProduct={selectedProduct}
          onClose={() => setOrderModalOpen(false)}
          onAddToCart={addToCart}
          onConfirmOrder={async (payload) => {
            await checkoutOrder(payload, false);
          }}
        />
      )}

      {orderLookupOpen && <OrderLookupModal onClose={() => setOrderLookupOpen(false)} />}

      {contactModalOpen && (
        <ContactModal
          onClose={() => setContactModalOpen(false)}
          onSubmitContact={sendContact}
        />
      )}

      {(activeArticle || knowledgeListOpen) && (
        <KnowledgeModal
          article={activeArticle}
          articles={knowledgeList}
          showAll={knowledgeListOpen}
          onSelectArticle={(art) => {
            setActiveArticle(art);
            if (!art) setKnowledgeListOpen(true);
          }}
          onClose={() => {
            setActiveArticle(null);
            setKnowledgeListOpen(false);
          }}
        />
      )}

      {reviewModalOpen && (
        <ReviewModal
          onClose={() => setReviewModalOpen(false)}
          onSubmitReview={sendReview}
        />
      )}

      {storyModalOpen && <StoryModal onClose={() => setStoryModalOpen(false)} />}

      {(activeStep || activeVideo) && (
        <InfoModal
          step={activeStep}
          video={activeVideo}
          onClose={() => {
            setActiveStep(null);
            setActiveVideo(null);
          }}
        />
      )}

      <ToastNotification message={toastMessage} />
    </div>
  );
};
