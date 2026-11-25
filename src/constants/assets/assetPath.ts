/**
 * Tạo đường dẫn tới thư mục public/assets/figma tương thích mọi môi trường
 * (chạy tốt cả ở localhost, tên miền gốc Vercel/Netlify lẫn thư mục con GitHub Pages)
 */
export const figmaAsset = (fileName: string): string =>
  `${import.meta.env.BASE_URL}assets/figma/${fileName}`;
