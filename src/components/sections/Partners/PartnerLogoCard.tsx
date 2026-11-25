import React from 'react';
import { PartnerLogoItem } from '../../../types/farm.types';
import { CroppedImage } from '../../common/CroppedImage';

interface PartnerLogoCardProps {
  partner: PartnerLogoItem;
}

/**
 * Thẻ nền trắng hiển thị 1 logo Đối tác phân phối
 */
export const PartnerLogoCard: React.FC<PartnerLogoCardProps> = ({ partner }) => {
  return (
    <div className="htf-partner-card" data-node-id={partner.nodeId} title={partner.name}>
      <div className="htf-partner-card__inner">
        <CroppedImage src={partner.logo} alt={partner.name} crop={partner.imageCrop} />
      </div>
    </div>
  );
};
