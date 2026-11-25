import React from 'react';
import { ImageCropConfig } from '../../types/farm.types';

interface CroppedImageProps {
  src: string;
  alt: string;
  crop?: ImageCropConfig;
  className?: string;
}

/**
 * Hiển thị ảnh theo đúng khung cắt Figma (nếu có crop) hoặc phủ kín khung (object-fit: cover)
 */
export const CroppedImage: React.FC<CroppedImageProps> = ({
  src,
  alt,
  crop,
  className = '',
}) => {
  if (crop) {
    return (
      <img
        src={src}
        alt={alt}
        className={`htf-img-cropped ${className}`.trim()}
        style={{
          width: crop.width,
          height: crop.height,
          left: crop.left,
          top: crop.top,
        }}
      />
    );
  }

  return <img src={src} alt={alt} className={`htf-img-cover ${className}`.trim()} />;
};
