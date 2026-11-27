import { apiRequest } from './apiClient';

const MAX_DIMENSION = 1280;

/**
 * Nén và thu phóng ảnh lớn từ điện thoại/máy tính xuống kích thước chuẩn web (< 400KB)
 * để tải nhanh và không bao giờ vượt giới hạn 4.5MB của Vercel Serverless
 */
async function prepareImageBase64(file: File): Promise<{ base64Data: string; contentType: string }> {
  if (file.type === 'image/gif') {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Không đọc được tệp ảnh.'));
      reader.readAsDataURL(file);
    });
    return { base64Data, contentType: 'image/gif' };
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.');
  ctx.drawImage(bitmap, 0, 0, width, height);

  const outputMime = file.type === 'image/png' ? 'image/png' : 'image/webp';
  const dataUrl = canvas.toDataURL(outputMime, 0.86);
  return { base64Data: dataUrl, contentType: outputMime };
}

/**
 * Tải tệp ảnh từ máy tính trực tiếp lên Supabase Storage và trả về đường dẫn công khai (publicUrl)
 */
export async function uploadImageToSupabase(file: File): Promise<string> {
  const { base64Data, contentType } = await prepareImageBase64(file);

  const res = await apiRequest<{ path: string; publicUrl: string }>('/api/upload', {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      contentType,
      base64Data,
    }),
  });

  return res.data.publicUrl;
}
