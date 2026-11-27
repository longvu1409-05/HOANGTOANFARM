# Hoàng Toàn Farm — Fullstack Web (Frontend + Backend)

Website **Hoàng Toàn Farm** (*Vườn sạch - Trái ngọt - Giá trị thật*) xây dựng bằng **React 19 + TypeScript + Vite** (Frontend) và **Node.js + Express 5 + SQLite** (Backend).

## Tính năng chính

- **Frontend (bám sát thiết kế Figma + đầy đủ tương tác):**
  - 4 sản phẩm tuyển chọn nổi bật mặc định + mở rộng **Xem toàn bộ sản phẩm** (7 sản phẩm có sẵn + lọc danh mục *Trái cây tươi / Quà biếu / Combo*).
  - **Tìm kiếm trực tiếp** trên Navbar (`GET /api/products?q=...`).
  - **Chi tiết sản phẩm** (mô tả, tồn kho, chọn số lượng, thêm vào giỏ / đặt mua ngay).
  - **Giỏ hàng trượt (Cart Drawer)** lưu `localStorage`, chỉnh số lượng, thanh toán nhiều sản phẩm cùng lúc.
  - **Tra cứu đơn hàng** theo SĐT hoặc mã đơn `HTF-...`.
  - **Đọc chi tiết Kiến thức lựa chọn**, **Gửi đánh giá khách hàng**, **Form Liên hệ tư vấn**, **Đăng ký nhận tin**.
- **Trang Quản trị (`?admin=1`):**
  - Quản lý **Đơn hàng** (xem chi tiết món, lọc SĐT/trạng thái, cập nhật trạng thái & tự hoàn kho khi hủy).
  - Quản lý **Sản phẩm (CRUD)**: Thêm mới, Sửa, Xóa sản phẩm.
  - Quản lý **Liên hệ & Đánh giá**, **Email nhận tin** và **Đăng bài Kiến thức mới**.

## Chạy cả Frontend & Backend

```bash
npm install
npm run dev
```

- **Trang chủ:** `http://localhost:5173/`
- **Trang Quản trị (CRUD Sản phẩm & Đơn hàng):** `http://localhost:5173/?admin=1`
- **Backend API:** `http://localhost:4000/api`
