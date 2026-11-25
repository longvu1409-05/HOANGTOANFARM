import React from 'react';
import { ProcessStep, PressVideoItem } from '../../types/farm.types';
import './Modals.css';

interface InfoModalProps {
  step?: ProcessStep | null;
  video?: PressVideoItem | null;
  onClose: () => void;
}

/**
 * Popup xem chi tiết một bước quy trình canh tác hoặc thông tin phóng sự truyền thông
 */
export const InfoModal: React.FC<InfoModalProps> = ({ step, video, onClose }) => {
  if (!step && !video) return null;

  return (
    <div className="htf-modal-backdrop" onClick={onClose}>
      <div className="htf-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="htf-modal__close" onClick={onClose} aria-label="Đóng">
          ×
        </button>

        {step && (
          <>
            <div className="htf-modal__media">
              <img src={step.image} alt={step.title} className="htf-img-cover" />
            </div>
            <h3 className="htf-modal__title htf-green-grad-text">{step.title}</h3>
            <p className="htf-modal__sub">{step.description}</p>
            <p className="htf-modal__detail">
              Quy trình tại HTX Dịch vụ Nông nghiệp Mường Khoe Xanh được giám sát nghiêm ngặt từ
              khâu cải tạo đất, chăm sóc hữu cơ theo tiêu chuẩn VietGAP đến thu hoạch đúng độ chín
              tự nhiên và vận chuyển lạnh trong ngày.
            </p>
          </>
        )}

        {video && (
          <>
            <div className="htf-modal__media">
              <img src={video.thumbnail} alt={video.title} className="htf-img-cover" />
            </div>
            <h3 className="htf-modal__title htf-green-grad-text">{video.title}</h3>
            <p className="htf-modal__detail">
              Phóng sự truyền thông ghi nhận hành trình phát triển giống vú sữa Hoàng Kim (HK-2) và
              mô hình liên kết nông sản sạch bền vững của Hoàng Toàn Farm tại Điện Biên.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
