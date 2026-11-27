import React, { useState } from 'react';
import { TRUST_ASSETS } from '../../../constants/assets';
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '../../../data/trustData';
import { ReviewDto } from '../../../services/contentApi';

interface TestimonialsPanelProps {
  reviews: ReviewDto[];
  onOpenReviewModal: () => void;
}

/**
 * Bảng bên phải: "Khách hàng nói về chúng tôi" (hiển thị đánh giá thực tế từ SQLite + chuyển trang)
 */
export const TestimonialsPanel: React.FC<TestimonialsPanelProps> = ({
  reviews,
  onOpenReviewModal,
}) => {
  const [page, setPage] = useState(0);

  const items =
    reviews.length > 0
      ? reviews.map((r) => ({
          id: r.id,
          author: r.author,
          quote: r.quote,
          avatar: `./assets/figma/${r.avatar_file}`,
        }))
      : FALLBACK_TESTIMONIALS;

  const pageSize = 2;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = page % totalPages;
  const visible = items.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return (
    <div className="htf-reviews-panel" data-node-id="505:135">
      <div className="htf-reviews-panel__head">
        <h2 className="htf-panel-title htf-green-grad-text" data-node-id="505:136">
          Khách hàng nói về chúng tôi
        </h2>
        <button
          type="button"
          className="htf-review-add-btn"
          onClick={onOpenReviewModal}
          title="Viết đánh giá của bạn"
        >
          + Gửi đánh giá
        </button>
      </div>

      <div className="htf-reviews-list">
        {visible.map((review) => (
          <article key={review.id} className="htf-review-card">
            <div className="htf-review-card__body">
              <p className="htf-review-card__quote">{review.quote}</p>
              <div className="htf-review-card__stars">
                <img
                  src={TRUST_ASSETS.testimonialStars}
                  alt="5 sao"
                  className="htf-svg-intrinsic"
                />
              </div>
              <p className="htf-review-card__author">{review.author}</p>
            </div>

            <div className="htf-review-card__avatar-wrap">
              <img
                src={review.avatar}
                alt={review.author}
                width={92}
                height={92}
                className="htf-review-card__avatar"
              />
            </div>
          </article>
        ))}
      </div>

      <div className="htf-reviews-dots" data-node-id="542:113">
        {totalPages > 1 ? (
          <div className="htf-dots-controls">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`htf-dot-btn ${safePage === idx ? 'is-active' : ''}`}
                onClick={() => setPage(idx)}
                aria-label={`Trang đánh giá ${idx + 1}`}
              />
            ))}
          </div>
        ) : (
          <img src={TRUST_ASSETS.testimonialDots} alt="" className="htf-svg-intrinsic" />
        )}
      </div>
    </div>
  );
};
