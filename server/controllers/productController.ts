import { Request, Response } from 'express';
import { productRepo } from '../repositories/productRepo.js';
import { sendNotFound, sendOk } from '../utils/response.js';

/**
 * Chuyển bản ghi SQLite sang JSON chuẩn cho Frontend
 */
function toProductDto(row: ReturnType<typeof productRepo.findAll>[number]) {
  return {
    id: row.id,
    nodeId: row.node_id,
    name: row.name,
    spec1: row.spec_1,
    spec2: row.spec_2,
    unit: row.unit,
    priceVnd: row.price_vnd,
    price: row.price_label,
    image: `./assets/figma/${row.image_file}`,
    imageCrop: row.crop_json ? JSON.parse(row.crop_json) : undefined,
    stock: row.stock,
    isFeatured: row.is_featured === 1,
  };
}

export const productController = {
  list(req: Request, res: Response) {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const rows = productRepo.findAll(q);
    return sendOk(res, rows.map(toProductDto));
  },

  getById(req: Request, res: Response) {
    const row = productRepo.findById(String(req.params.id));
    if (!row) {
      return sendNotFound(res, 'Không tìm thấy sản phẩm.');
    }
    return sendOk(res, toProductDto(row));
  },
};
