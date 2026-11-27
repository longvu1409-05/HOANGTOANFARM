import React from 'react';
import { PreFooterBanner } from './PreFooterBanner';
import { FooterMain } from './FooterMain';
import './Footer.css';

interface FooterSectionProps {
  onOpenOrderModal: () => void;
  onSubscribed: (email: string) => Promise<void>;
  onOpenContact: () => void;
  onOpenOrderLookup: () => void;
  onOpenStory: () => void;
}

/**
 * Khu vực cuối trang: gồm PreFooterBanner (kêu gọi đặt hàng) và FooterMain (5 cột thông tin)
 */
export const FooterSection: React.FC<FooterSectionProps> = ({
  onOpenOrderModal,
  onSubscribed,
  onOpenContact,
  onOpenOrderLookup,
  onOpenStory,
}) => {
  return (
    <footer className="htf-footer-wrap" id="lien-he">
      <PreFooterBanner onOpenOrderModal={onOpenOrderModal} />
      <FooterMain
        onSubscribed={onSubscribed}
        onOpenContact={onOpenContact}
        onOpenOrderLookup={onOpenOrderLookup}
        onOpenStory={onOpenStory}
      />
    </footer>
  );
};
