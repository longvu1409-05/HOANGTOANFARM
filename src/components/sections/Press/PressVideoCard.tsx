import React from 'react';
import { PRESS_KNOWLEDGE_ASSETS } from '../../../constants/assets';
import { PressVideoItem } from '../../../types/farm.types';

interface PressVideoCardProps {
  video: PressVideoItem;
  onSelect: (video: PressVideoItem) => void;
}

/**
 * Thẻ hiển thị 1 video phóng sự truyền hình (ảnh thu nhỏ + nút Play YouTube + tiêu đề)
 */
export const PressVideoCard: React.FC<PressVideoCardProps> = ({ video, onSelect }) => {
  return (
    <article
      className="htf-video-card"
      data-node-id={video.nodeId}
      onClick={() => onSelect(video)}
    >
      <div className="htf-video-card__thumb">
        <img src={video.thumbnail} alt={video.title} className="htf-img-cover" />
        <button
          type="button"
          className="htf-video-card__play"
          aria-label={`Xem video: ${video.title}`}
        >
          <img
            src={PRESS_KNOWLEDGE_ASSETS.youtubeRedBg}
            alt=""
            className="htf-svg-intrinsic htf-video-card__yt-bg"
          />
          <img
            src={PRESS_KNOWLEDGE_ASSETS.youtubePlayIcon}
            alt=""
            className="htf-svg-intrinsic htf-video-card__yt-tri"
          />
        </button>
      </div>

      <h3 className="htf-video-card__title htf-green-grad-text">{video.title}</h3>
    </article>
  );
};
