import { Router } from 'express';
import { productController } from '../controllers/productController.js';

export const productRoutes = Router();

productRoutes.get('/', productController.list);
productRoutes.get('/:id', productController.getById);
