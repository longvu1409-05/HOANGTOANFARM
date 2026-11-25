import React from 'react';
import { TRUST_ASSETS } from '../../../constants/assets';
import { CommitmentsPanel } from './CommitmentsPanel';
import { TestimonialsPanel } from './TestimonialsPanel';
import './Trust.css';

/**
 * Khu vực kết hợp 2 cột: "Cam kết của chúng tôi" & "Khách hàng nói về chúng tôi"
 */
export const CommitmentsTestimonialsSection: React.FC = () => {
  return (
    <section className="htf-trust-section" data-node-id="714:568">
      <div className="htf-trust-section__bg" aria-hidden="true">
        <img src={TRUST_ASSETS.commitmentsBg} alt="" className="htf-img-cover" />
        <div className="htf-trust-section__bg-fade" />
      </div>

      <div className="htf-container htf-trust-section__inner">
        <CommitmentsPanel />
        <TestimonialsPanel />
      </div>
    </section>
  );
};
