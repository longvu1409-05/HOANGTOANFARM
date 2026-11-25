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
import { InfoModal } from '../components/modals/InfoModal';
import { ToastNotification } from '../components/modals/ToastNotification';
import { useHomeInteractions } from '../hooks/useHomeInteractions';

/**
 * Trang chủ Hoàng Toàn Farm — sắp xếp các phân khu theo đúng thứ tự từ trên xuống dưới.
 * Muốn ẩn/hiện hoặc đổi vị trí một phần trên trang chủ, chỉ cần chỉnh tại đây.
 */
export const HomePage: React.FC = () => {
  const {
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
  } = useHomeInteractions();

  return (
    <div className="htf-page" data-node-id="675:126" data-name="Desktop - 3">
      {/* 1. Đầu trang */}
      <Header cartCount={cartCount} onOpenOrderModal={openGeneralOrderModal} />

      {/* 2. Nội dung chính theo thứ tự thiết kế */}
      <main>
        <HeroSection onOpenOrderModal={openGeneralOrderModal} />
        <FeaturedProductsSection onSelectProduct={openProductOrderModal} />
        <BrandStoryBanner />
        <GrowingProcessSection onSelectStep={setActiveStep} />
        <CommitmentsTestimonialsSection />
        <PressMediaSection onSelectVideo={setActiveVideo} />
        <SelectionKnowledgeSection />
        <PartnersSection />
      </main>

      {/* 3. Cuối trang */}
      <FooterSection
        onOpenOrderModal={openGeneralOrderModal}
        onSubscribed={subscribeNewsletter}
      />

      {/* 4. Các hộp thoại Popup & Thông báo */}
      {orderModalOpen && (
        <OrderModal
          selectedProduct={selectedProduct}
          onClose={closeOrderModal}
          onConfirmOrder={confirmOrder}
        />
      )}

      {(activeStep || activeVideo) && (
        <InfoModal step={activeStep} video={activeVideo} onClose={closeInfoModal} />
      )}

      <ToastNotification message={toastMessage} />
    </div>
  );
};
