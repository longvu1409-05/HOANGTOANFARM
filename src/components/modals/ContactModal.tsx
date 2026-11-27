import React, { useState } from 'react';
import { CreateContactPayload } from '../../services/contactApi';
import './Modals.css';

interface ContactModalProps {
  onClose: () => void;
  onSubmitContact: (payload: CreateContactPayload) => Promise<void>;
}

/**
 * Popup gửi yêu cầu liên hệ / tư vấn đặt quà số lượng lớn
 */
export const ContactModal: React.FC<ContactModalProps> = ({ onClose, onSubmitContact }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tư vấn đặt hàng & quà biếu');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await onSubmitContact({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể gửi tin nhắn lúc này.');
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
        <h3 className="htf-modal__title htf-green-grad-text">Liên hệ Hoàng Toàn Farm</h3>
        <p className="htf-modal__sub">
          Tư vấn đặt quà doanh nghiệp, hợp tác phân phối hoặc hỗ trợ sau bán hàng.
        </p>

        <form className="htf-modal__form" onSubmit={handleSubmit}>
          <div className="htf-modal__row-2-eq">
            <label className="htf-modal__label">
              Họ và tên
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="htf-modal__input"
                required
              />
            </label>
            <label className="htf-modal__label">
              Số điện thoại
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0989.xxx.xxx"
                className="htf-modal__input"
                required
              />
            </label>
          </div>

          <label className="htf-modal__label">
            Email (không bắt buộc)
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@congty.vn"
              className="htf-modal__input"
            />
          </label>

          <label className="htf-modal__label">
            Chủ đề cần hỗ trợ
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="htf-modal__input"
            >
              <option>Tư vấn đặt hàng &amp; quà biếu</option>
              <option>Đặt quà số lượng lớn (Doanh nghiệp)</option>
              <option>Đăng ký làm đối tác phân phối</option>
              <option>Hỗ trợ đổi trả / Khiếu nại</option>
            </select>
          </label>

          <label className="htf-modal__label">
            Nội dung chi tiết
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nhu cầu hoặc câu hỏi của bạn..."
              className="htf-modal__input htf-modal__textarea"
              rows={3}
              required
            />
          </label>

          {errorMsg && <p className="htf-modal__error">{errorMsg}</p>}

          <button type="submit" className="htf-modal__submit" disabled={submitting}>
            {submitting ? 'Đang gửi...' : 'Gửi yêu cầu liên hệ'}
          </button>
        </form>
      </div>
    </div>
  );
};
