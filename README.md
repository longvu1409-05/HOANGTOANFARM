# Hoàng Toàn Farm — Frontend Website

Giao diện trang chủ **Hoàng Toàn Farm** (*Vườn sạch - Trái ngọt - Giá trị thật*), xây dựng bằng **React 19 + TypeScript + Vite** từ bản thiết kế Figma.

## Chạy dự án tại máy (Local)

```bash
npm install
npm run dev
```

## Đóng gói bản Production

```bash
npm run build
```

## Cấu trúc mã nguồn

- `src/pages/HomePage.tsx`: Bố cục tổng thể các phần trên trang chủ.
- `src/components/`: Tách nhỏ từng khu vực (`Header`, `Hero`, `Products`, `BrandStory`, `Process`, `Trust`, `Press`, `Knowledge`, `Partners`, `Footer`, `modals`) kèm file `.css` riêng ngay cạnh từng component.
- `src/data/`: Dữ liệu văn bản, giá sản phẩm, bài viết tách riêng từng mục để dễ chỉnh sửa.
- `src/constants/assets/`: Quản lý hình ảnh & icon theo từng khu vực.
- `src/styles/`: Biến màu sắc, font chữ (`variables.css`) và khung cơ bản (`base.css`).
