import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  titleNodeId?: string;
  subtitleNodeId?: string;
  greenSubtitle?: boolean;
}

/**
 * Cụm tiêu đề + mô tả căn giữa dùng chung cho các phân khu trên trang chủ
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  titleNodeId,
  subtitleNodeId,
  greenSubtitle = false,
}) => {
  return (
    <div className="htf-section-header">
      <h2 className="htf-section-title htf-green-grad-text" data-node-id={titleNodeId}>
        {title}
      </h2>
      {subtitle && (
        <p
          className={`htf-section-subtitle ${greenSubtitle ? 'htf-green-grad-text' : ''}`}
          data-node-id={subtitleNodeId}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
