import React from 'react';
import { STORY_PROCESS_ASSETS } from '../../constants/assets';
import './Modals.css';

interface StoryModalProps {
  onClose: () => void;
}

/**
 * Popup giới thiệu câu chuyện thương hiệu Hoàng Toàn Farm & HTX Mường Khoe Xanh
 */
export const StoryModal: React.FC<StoryModalProps> = ({ onClose }) => {
  return (
    <div className="htf-modal-backdrop" onClick={onClose}>
      <div className="htf-modal htf-modal--wide" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
          ×
        </button>

        <div className="htf-modal__media">
          <img
            src={STORY_PROCESS_ASSETS.storyBannerBg}
            alt="Hành trình làm nông bằng cái tâm"
            className="htf-img-cover"
          />
        </div>

        <span className="htf-badge-pill">Câu chuyện thương hiệu</span>
        <h3 className="htf-modal__title htf-green-grad-text">
          Hành trình làm nông bằng cái tâm
        </h3>
        <p className="htf-modal__detail">
          <strong>Hoàng Toàn Farm</strong> là thương hiệu thuộc Công ty Cổ phần Đầu tư Rau Quả
          Việt Nam, liên kết sản xuất cùng <strong>HTX Dịch vụ Nông nghiệp Mường Khoe Xanh</strong>{' '}
          tại Mường Ảng, Điện Biên. Thay vì chạy theo sản lượng, chúng tôi canh tác hữu cơ theo quy
          trình VietGAP, đợi trái đạt đúng độ chín tự nhiên trên cây mới thu hoạch và đóng gói lạnh
          giao tận tay khách hàng trong ngày.
        </p>
        <div className="htf-modal__footer-actions">
          <a href="#vung-trong" className="htf-modal__submit htf-modal__link-btn" onClick={onClose}>
            Xem 4 bước vùng trồng &amp; quy trình
          </a>
        </div>
      </div>
    </div>
  );
};
