import React from 'react';
import { TRUST_ASSETS } from '../../../constants/assets';
import { COMMITMENTS } from '../../../data/trustData';

/**
 * Bảng bên trái: "Cam kết của chúng tôi" (3 tiêu chí chất lượng & dịch vụ)
 */
export const CommitmentsPanel: React.FC = () => {
  return (
    <div className="htf-commit-panel" data-node-id="505:134">
      <h2 className="htf-panel-title htf-green-grad-text" data-node-id="505:140">
        Cam kết của chúng tôi
      </h2>

      <ul className="htf-commit-list">
        {COMMITMENTS.map((item) => (
          <li key={item.id} className="htf-commit-item" data-node-id={item.nodeId}>
            <div className="htf-commit-item__badge">
              <img
                src={TRUST_ASSETS.commitmentCircleBg}
                alt=""
                className="htf-svg-intrinsic htf-commit-item__circle"
              />
              <img
                src={item.icon}
                alt=""
                className="htf-svg-intrinsic htf-commit-item__icon"
              />
            </div>

            <div className="htf-commit-item__text">
              <h3 className="htf-commit-item__title htf-green-grad-text">{item.title}</h3>
              <p className="htf-commit-item__desc">{item.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
