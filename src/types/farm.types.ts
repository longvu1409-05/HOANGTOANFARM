/**
 * Định nghĩa các kiểu dữ liệu dùng chung cho toàn bộ trang Hoàng Toàn Farm.
 */

export interface ImageCropConfig {
  width: string;
  height: string;
  left: string;
  top: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: string[];
}

export interface ProductItem {
  id: string;
  nodeId: string;
  name: string;
  category?: string;
  description?: string;
  image: string;
  imageFile?: string;
  imageCrop?: ImageCropConfig;
  spec1: string;
  spec2: string;
  unit: string;
  price: string;
  priceVnd?: number;
  stock?: number;
  isFeatured?: boolean;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
}

export interface ProcessStep {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  image: string;
  imageCrop?: ImageCropConfig;
}

export interface CommitmentItem {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  icon: string;
}

export interface TestimonialItem {
  id: string | number;
  nodeId?: string;
  quote: string;
  author: string;
  avatar: string;
  rating?: number;
}

export interface FeaturedPressArticle {
  id: string;
  title: string;
  lead: string;
  brand: string;
  tail: string;
}

export interface PressVideoItem {
  id: string;
  nodeId: string;
  title: string;
  thumbnail: string;
}

export interface KnowledgeArticleItem {
  id: string;
  nodeId?: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  imageCrop?: ImageCropConfig;
  isFeatured?: boolean;
}

export interface PartnerLogoItem {
  id: string;
  nodeId: string;
  name: string;
  logo: string;
  imageCrop: ImageCropConfig;
}

export interface PreFooterFeatureItem {
  id: string;
  nodeId: string;
  icon: string;
  text: string;
}
