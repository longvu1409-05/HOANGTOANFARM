import { Request, Response } from 'express';
import { productRepo } from '../repositories/productRepo.js';
import { ProductRecord } from '../types/backend.types.js';
import { sendBadRequest, sendCreated, sendNotFound, sendOk } from '../utils/response.js';
import { validateProductInput } from '../utils/validators.js';

function resolveImageUrl(imageFile: string): string {
  if (imageFile.startsWith('http://') || imageFile.startsWith('https://') || imageFile.startsWith('./') || imageFile.startsWith('/')) {
    return imageFile;
  }
  return `./assets/figma/${imageFile}`;
}

/**
 * Chuyển bản ghi SQLite sang JSON chuẩn cho Frontend
 */
function toProductDto(row: ProductRecord) {
  return {
    id: row.id,
    nodeId: row.node_id,
    name: row.name,
    category: row.category,
    description: row.description,
    spec1: row.spec_1,
    spec2: row.spec_2,
    unit: row.unit,
    priceVnd: row.price_vnd,
    price: row.price_label,
    image: resolveImageUrl(row.image_file),
    imageFile: row.image_file,
    imageCrop: row.crop_json ? JSON.parse(row.crop_json) : undefined,
    stock: row.stock,
    isFeatured: row.is_featured === 1,
  };
}

export const productController = {
  list(req: Request, res: Response) {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const featuredOnly = req.query.featured === '1';

    const rows = productRepo.findAll({ q, category, featuredOnly });
    return sendOk(res, rows.map(toProductDto));
  },

  getById(req: Request, res: Response) {
    const row = productRepo.findById(String(req.params.id));
    if (!row) {
      return sendNotFound(res, 'Không tìm thấy sản phẩm.');
    }
    return sendOk(res, toProductDto(row));
  },

  create(req: Request, res: Response) {
    const { error, value } = validateProductInput((req.body ?? {}) as Record<string, unknown>);
    if (error || !value) {
      return sendBadRequest(res, error ?? 'Thông tin sản phẩm không hợp lệ.');
    }

    const created = productRepo.create(value);
    return sendCreated(res, toProductDto(created), `Đã thêm sản phẩm "${created.name}".`);
  },

  update(req: Request, res: Response) {
    const id = String(req.params.id);
    const { error, value } = validateProductInput((req.body ?? {}) as Record<string, unknown>);
    if (error || !value) {
      return sendBadRequest(res, error ?? 'Thông tin cập nhật không hợp lệ.');
    }

    const updated = productRepo.update(id, value);
    if (!updated) {
      return sendNotFound(res, 'Không tìm thấy sản phẩm cần cập nhật.');
    }
    return sendOk(res, toProductDto(updated), `Đã cập nhật sản phẩm "${updated.name}".`);
  },

  remove(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = productRepo.remove(id);
    if (!result.deleted) {
      return sendNotFound(res, 'Không tìm thấy sản phẩm cần xóa.');
    }
    return sendOk(
      res,
      { id, ...result },
      result.softDeleted
        ? 'Sản phẩm đã có đơn hàng nên đã chuyển sang trạng thái ẩn.'
        : 'Đã xóa sản phẩm thành công.'
    );
  },
};
