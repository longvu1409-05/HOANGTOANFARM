import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { requireAdmin } from '../utils/adminAuth.js';

export const orderRoutes = Router();

orderRoutes.get('/', orderController.list);
orderRoutes.post('/', orderController.create);
orderRoutes.patch('/:id/status', requireAdmin, orderController.updateStatus);
