# Hoàng Toàn Farm — Fullstack Web (Frontend + Backend)

Giao diện trang chủ **Hoàng Toàn Farm** (*Vườn sạch - Trái ngọt - Giá trị thật*) kèm **Backend API (Node.js + Express + SQLite)**.

## Chạy cả Frontend & Backend (Local)

```bash
npm install
npm run dev
```

- **Trang chủ Frontend:** `http://localhost:5173/`
- **Trang quản lý đơn hàng & email:** `http://localhost:5173/?admin=1`
- **Backend API:** `http://localhost:4000/api`

## Đóng gói Production

```bash
npm run build
npm start
```

## API Endpoints chính

- `GET /api/health` — Kiểm tra trạng thái server
- `GET /api/products?q=...` — Lấy danh sách & tìm kiếm sản phẩm
- `GET /api/products/:id` — Chi tiết 1 sản phẩm
- `POST /api/orders` — Tạo đơn đặt quà mới (sinh mã `HTF-YYYYMMDD-XXXX`, tính tiền server-side)
- `GET /api/orders` — Lấy danh sách đơn hàng & thống kê (hỗ trợ `?phone=...`, `?code=...`, `?status=...`)
- `PATCH /api/orders/:id/status` — Cập nhật trạng thái đơn hàng
- `POST /api/newsletter` — Đăng ký email nhận tin
- `GET /api/newsletter` — Danh sách email đã đăng ký
- `GET /api/content/reviews` | `POST /api/content/reviews` — Đánh giá khách hàng
- `GET /api/content/knowledge` — Bài viết kiến thức lựa chọn

## Cấu trúc mã nguồn Backend (`server/`)

- `server/config/env.ts`: Cấu hình cổng & đường dẫn DB
- `server/db/database.ts` & `server/db/seed.ts`: Khởi tạo SQLite & dữ liệu mẫu
- `server/repositories/`: Truy vấn SQL tách riêng từng bảng (`productRepo`, `orderRepo`, `newsletterRepo`, `contentRepo`)
- `server/controllers/`: Xử lý logic từng nhóm API
- `server/routes/`: Định nghĩa đường dẫn `/api/...`
- `server/utils/`: Kiểm tra đầu vào (`validators`), định dạng mã đơn/tiền (`formatters`), phản hồi chuẩn (`response`)
