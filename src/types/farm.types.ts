/**
 * Định nghĩa các kiểu dữ liệu dùng chung cho toàn bộ trang Hoàng Toàn Farm.
 */

/** Cấu hình khung cắt ảnh theo đúng tỷ lệ thiết kế Figma */
export interface ImageCropConfig {
  width: string;
  height: string;
  left: string;
  top: string;
}

/** Mục điều hướng trên thanh Menu chính */
export interface NavItem {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: string[];
}

/** Thông tin một sản phẩm nổi bật */
export interface ProductItem {
  id: string;
  nodeId: string;
  name: string;
  image: string;
  imageCrop?: ImageCropConfig;
  spec1: string;
  spec2: string;
  unit: string;
  price: string;
  priceVnd?: number;
}

/** Bước trong mục Vùng trồng & Quy trình */
export interface ProcessStep {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  image: string;
  imageCrop?: ImageCropConfig;
}

/** Mục trong khối Cam kết của chúng tôi */
export interface CommitmentItem {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  icon: string;
}

/** Đánh giá của khách hàng */
export interface TestimonialItem {
  id: string;
  nodeId: string;
  quote: string;
  author: string;
  avatar: string;
}

/** Bài viết tiêu điểm trong phần Báo chí & Truyền thông */
export interface FeaturedPressArticle {
  id: string;
  title: string;
  lead: string;
  brand: string;
  tail: string;
}

/** Thẻ video phóng sự truyền hình */
export interface PressVideoItem {
  id: string;
  nodeId: string;
  title: string;
  thumbnail: string;
}

/** Bài viết trong mục Kiến thức lựa chọn */
export interface KnowledgeArticleItem {
  id: string;
  nodeId: string;
  title: string;
  excerpt: string;
  image: string;
  imageCrop?: ImageCropConfig;
}

/** Logo đối tác phân phối */
export interface PartnerLogoItem {
  id: string;
  nodeId: string;
  name: string;
  logo: string;
  imageCrop: ImageCropConfig;
}

/** Dòng điểm mạnh tại banner trước chân trang */
export interface PreFooterFeatureItem {
  id: string;
  nodeId: string;
  icon: string;
  text: string;
}
