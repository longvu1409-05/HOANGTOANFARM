import React from 'react';
import { STORY_PROCESS_ASSETS } from '../../../constants/assets';
import { STORY_BULLETS } from '../../../data/storyData';
import { CroppedImage } from '../../common/CroppedImage';
import './BrandStory.css';

interface BrandStoryBannerProps {
  onOpenStory: () => void;
}

/**
 * Banner "Hành trình làm nông bằng cái tâm" (Câu chuyện thương hiệu)
 */
export const BrandStoryBanner: React.FC<BrandStoryBannerProps> = ({ onOpenStory }) => {
  return (
    <section className="htf-story-banner" id="cau-chuyen" data-node-id="689:455">
      <div className="htf-story-banner__bg" aria-hidden="true">
        <CroppedImage
          src={STORY_PROCESS_ASSETS.storyBannerBg}
          alt=""
          crop={{
            width: '103.01%',
            height: '168.41%',
            left: '0.01%',
            top: '-20.46%',
          }}
        />
        <div className="htf-story-banner__overlay" />
      </div>

      <div className="htf-container htf-story-banner__inner">
        <div className="htf-story-banner__content">
          <h2 className="htf-story-banner__title" data-node-id="693:456">
            Hành trình làm nông bằng cái tâm
          </h2>

          <ul className="htf-story-banner__bullets">
            {STORY_BULLETS.map((bullet) => (
              <li
                key={bullet.id}
                className="htf-story-banner__bullet"
                data-node-id={bullet.nodeId}
              >
                <span className="htf-story-banner__bullet-icon">
                  <img
                    src={STORY_PROCESS_ASSETS.storyBulletTriangle}
                    alt=""
                    className="htf-svg-intrinsic"
                  />
                </span>
                <span>{bullet.text}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="htf-btn-story"
            onClick={onOpenStory}
            data-node-id="693:457"
          >
            <span className="htf-green-grad-text" data-node-id="693:458">
              xem câu chuyện của chúng tôi
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
