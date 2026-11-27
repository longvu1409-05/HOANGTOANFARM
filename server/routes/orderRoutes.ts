import { Router } from 'express';
import { orderController } from '../controllers/orderController';

export const orderRoutes = Router();

orderRoutes.get('/', orderController.list);
orderRoutes.post('/', orderController.create);
orderRoutes.patch('/:id/status', orderController.updateStatus);
