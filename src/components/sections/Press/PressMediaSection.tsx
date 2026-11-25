import React from 'react';
import { PRESS_VIDEOS } from '../../../data/pressData';
import { PressVideoItem } from '../../../types/farm.types';
import { SectionHeader } from '../../common/SectionHeader';
import { PressFeaturedBento } from './PressFeaturedBento';
import { PressVideoCard } from './PressVideoCard';
import './Press.css';

interface PressMediaSectionProps {
  onSelectVideo: (video: PressVideoItem) => void;
}

/**
 * Khu vực "Báo chí & Truyền thông": gồm cụm Bento bài báo sự kiện & lưới 3 video phóng sự
 */
export const PressMediaSection: React.FC<PressMediaSectionProps> = ({ onSelectVideo }) => {
  return (
    <section className="htf-press-section">
      <div className="htf-container">
        <SectionHeader
          title="Báo chí & Truyền thông"
          subtitle="Kết nối nông trại sạch đến tay người tiêu dùng thông thái"
          titleNodeId="711:526"
          subtitleNodeId="711:533"
        />

        <PressFeaturedBento />

        <div className="htf-press-videos">
          {PRESS_VIDEOS.map((video) => (
            <PressVideoCard key={video.id} video={video} onSelect={onSelectVideo} />
          ))}
        </div>
      </div>
    </section>
  );
};
