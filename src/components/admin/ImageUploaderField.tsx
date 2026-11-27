import React, { useRef, useState } from 'react';
import { resolveAssetUrl } from '../../constants/assets/assetPath';
import { AVAILABLE_PRODUCT_IMAGES } from '../../data/productsData';
import { uploadImageToSupabase } from '../../services/uploadApi';

interface ImageUploaderFieldProps {
  value: string;
  onChange: (nextImageUrlOrFile: string) => void;
  onNotify: (msg: string) => void;
  label?: string;
}

/**
 * Ô chọn hoặc tải ảnh trực tiếp từ máy tính/điện thoại lên Supabase Storage kèm khung xem trước
 */
export const ImageUploaderField: React.FC<ImageUploaderFieldProps> = ({
  value,
  onChange,
  onNotify,
  label = 'Ảnh đại diện sản phẩm',
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await uploadImageToSupabase(file);
      onChange(publicUrl);
      onNotify('Đã tải ảnh lên Supabase Storage thành công!');
    } catch (err) {
      onNotify(err instanceof Error ? err.message : 'Tải ảnh thất bại.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="htf-admin-upload">
      <span className="htf-admin-upload__label">{label}</span>

      <div className="htf-admin-upload__box">
        <img
          src={resolveAssetUrl(value)}
          alt="Xem trước ảnh"
          className="htf-admin-upload__preview"
        />

        <div className="htf-admin-upload__controls">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileChange}
            hidden
          />

          <button
            type="button"
            className="htf-admin-upload__btn"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? 'Đang tải lên Supabase...' : '📤 Tải ảnh từ máy tính / điện thoại'}
          </button>

          <select
            value={AVAILABLE_PRODUCT_IMAGES.some((i) => i.file === value) ? value : ''}
            onChange={(e) => e.target.value && onChange(e.target.value)}
          >
            <option value="">— Hoặc chọn nhanh ảnh mẫu có sẵn —</option>
            {AVAILABLE_PRODUCT_IMAGES.map((img) => (
              <option key={img.file} value={img.file}>
                {img.label}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL ảnh trên Supabase hoặc internet..."
          />
        </div>
      </div>
    </div>
  );
};
