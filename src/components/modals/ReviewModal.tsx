import React, { useState } from 'react';
import './Modals.css';

interface ReviewModalProps {
  onClose: () => void;
  onSubmitReview: (payload: { author: string; quote: string; rating: number }) => Promise<void>;
}

/**
 * Popup khách hàng gửi đánh giá trải nghiệm mua hàng
 */
export const ReviewModal: React.FC<ReviewModalProps> = ({ onClose, onSubmitReview }) => {
  const [author, setAuthor] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await onSubmitReview({
        author: author.trim(),
        quote: quote.trim(),
        rating,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể gửi đánh giá lúc này.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="htf-modal-backdrop" onClick={onClose}>
      <div className="htf-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <h3 className="htf-modal__title htf-green-grad-text">Gửi đánh giá của bạn</h3>
        <p className="htf-modal__sub">
          Chia sẻ cảm nhận về trái cây &amp; dịch vụ của Hoàng Toàn Farm.
        </p>

        <form className="htf-modal__form" onSubmit={handleSubmit}>
          <label className="htf-modal__label">
            Tên &amp; Khu vực của bạn
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ví dụ: Chị Lan - Hải Phòng"
              className="htf-modal__input"
              required
            />
          </label>

          <label className="htf-modal__label">
            Mức độ hài lòng
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="htf-modal__input"
            >
              <option value={5}>★★★★★ (5 sao - Rất hài lòng)</option>
              <option value={4}>★★★★☆ (4 sao - Hài lòng)</option>
              <option value={3}>★★★☆☆ (3 sao - Bình thường)</option>
            </select>
          </label>

          <label className="htf-modal__label">
            Cảm nhận của bạn
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Trái cây ngọt thanh, đóng gói cẩn thận..."
              className="htf-modal__input htf-modal__textarea"
              rows={3}
              required
            />
          </label>

          {errorMsg && <p className="htf-modal__error">{errorMsg}</p>}

          <button type="submit" className="htf-modal__submit" disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Đăng đánh giá'}
          </button>
        </form>
      </div>
    </div>
  );
};
