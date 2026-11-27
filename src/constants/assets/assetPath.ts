/**
 * Tạo đường dẫn tới thư mục public/assets/figma tương thích mọi môi trường
 * (chạy tốt cả ở localhost, tên miền gốc Vercel/Netlify lẫn thư mục con GitHub Pages)
 */
export const figmaAsset = (fileName: string): string =>
  `${import.meta.env.BASE_URL}assets/figma/${fileName}`;

/**
 * Chuẩn hóa tên file hoặc URL ảnh thành đường dẫn hiển thị hợp lệ không bị lặp tiền tố
 */
export const resolveAssetUrl = (fileOrUrl?: string): string => {
  const trimmed = (fileOrUrl ?? '').trim();
  if (!trimmed) {
    return `${import.meta.env.BASE_URL}assets/figma/imgRectangle16.png`;
  }
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('/')
  ) {
    return trimmed;
  }
  return `${import.meta.env.BASE_URL}assets/figma/${trimmed}`;
};
