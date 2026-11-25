import React from 'react';
import { STORY_PROCESS_ASSETS } from '../../../constants/assets';
import { PROCESS_STEPS } from '../../../data/processData';
import { ProcessStep } from '../../../types/farm.types';
import { SectionHeader } from '../../common/SectionHeader';
import { ProcessCard } from './ProcessCard';
import './Process.css';

interface GrowingProcessSectionProps {
  onSelectStep: (step: ProcessStep) => void;
}

/**
 * Khu vực "Vùng trồng & Quy trình": nền khung cành vú sữa + 4 bước quy trình
 */
export const GrowingProcessSection: React.FC<GrowingProcessSectionProps> = ({ onSelectStep }) => {
  return (
    <section className="htf-process-section" id="vung-trong" data-node-id="696:474">
      <div className="htf-process-section__bg" aria-hidden="true">
        <img
          src={STORY_PROCESS_ASSETS.processBgFrame}
          alt=""
          className="htf-process-section__bg-img"
        />
        <div className="htf-process-section__bg-glow" />
      </div>

      <div className="htf-container htf-process-section__inner">
        <SectionHeader
          title="Vùng trồng & Quy trình"
          subtitle="Canh tác an toàn – Tận tâm đến tay bạn"
          titleNodeId="693:468"
          subtitleNodeId="693:469"
          greenSubtitle
        />

        <div className="htf-process-grid">
          {PROCESS_STEPS.map((step) => (
            <ProcessCard key={step.id} step={step} onSelect={onSelectStep} />
          ))}
        </div>
      </div>
    </section>
  );
};
