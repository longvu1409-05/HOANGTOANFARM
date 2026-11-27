import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { requireAdmin } from '../utils/adminAuth.js';

export const productRoutes = Router();

productRoutes.get('/', productController.list);
productRoutes.get('/:id', productController.getById);
productRoutes.post('/', requireAdmin, productController.create);
productRoutes.put('/:id', requireAdmin, productController.update);
productRoutes.delete('/:id', requireAdmin, productController.remove);
