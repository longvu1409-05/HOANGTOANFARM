import React from 'react';
import { STORY_PROCESS_ASSETS } from '../../../constants/assets';
import { ProcessStep } from '../../../types/farm.types';
import { CroppedImage } from '../../common/CroppedImage';

interface ProcessCardProps {
  step: ProcessStep;
  onSelect: (step: ProcessStep) => void;
}

/**
 * Thẻ hiển thị 1 bước trong khu vực Vùng trồng & Quy trình
 */
export const ProcessCard: React.FC<ProcessCardProps> = ({ step, onSelect }) => {
  return (
    <article className="htf-process-card" data-node-id={step.nodeId}>
      <div className="htf-process-card__img-box">
        <CroppedImage src={step.image} alt={step.title} crop={step.imageCrop} />
      </div>

      <h3 className="htf-process-card__title htf-green-grad-text">{step.title}</h3>
      <p className="htf-process-card__desc">{step.description}</p>

      <button type="button" className="htf-process-card__btn" onClick={() => onSelect(step)}>
        <span className="htf-gold-text">Xem quy trình</span>
        <img src={STORY_PROCESS_ASSETS.processBtnArrow} alt="" className="htf-svg-intrinsic" />
      </button>
    </article>
  );
};
