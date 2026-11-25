import { PARTNER_FOOTER_ASSETS } from '../constants/assets';
import { PartnerLogoItem } from '../types/farm.types';

/**
 * Danh sách 6 thẻ logo tại mục "Đối tác phân phối"
 */
export const PARTNER_LOGOS: PartnerLogoItem[] = [
  {
    id: 'partner-1',
    nodeId: '722:692',
    name: 'Bác Tôm Thuận Tự Nhiên',
    logo: PARTNER_FOOTER_ASSETS.partner1,
    imageCrop: {
      width: '92.18%',
      height: '85.27%',
      left: '3.91%',
      top: '7.37%',
    },
  },
  {
    id: 'partner-2',
    nodeId: '722:693',
    name: 'BigGreen',
    logo: PARTNER_FOOTER_ASSETS.partner2,
    imageCrop: {
      width: '122.94%',
      height: '217.37%',
      left: '-11.47%',
      top: '-58.69%',
    },
  },
  {
    id: 'partner-3',
    nodeId: '722:696',
    name: 'Phương Dung Fresh Fruit',
    logo: PARTNER_FOOTER_ASSETS.partner3,
    imageCrop: {
      width: '83.72%',
      height: '148.06%',
      left: '8.14%',
      top: '-21.97%',
    },
  },
  {
    id: 'partner-4',
    nodeId: '722:705',
    name: 'Đối tác nông sản sạch',
    logo: PARTNER_FOOTER_ASSETS.partner4,
    imageCrop: {
      width: '58.31%',
      height: '100%',
      left: '20.85%',
      top: '0%',
    },
  },
  {
    id: 'partner-5',
    nodeId: '722:706',
    name: 'BigGreen Hệ thống cửa hàng',
    logo: PARTNER_FOOTER_ASSETS.partner2,
    imageCrop: {
      width: '122.94%',
      height: '217.37%',
      left: '-11.47%',
      top: '-58.69%',
    },
  },
  {
    id: 'partner-6',
    nodeId: '722:707',
    name: 'Phương Dung Hoa Quả Thực Phẩm Sạch',
    logo: PARTNER_FOOTER_ASSETS.partner3,
    imageCrop: {
      width: '76.96%',
      height: '143.28%',
      left: '11.52%',
      top: '-19.12%',
    },
  },
];
