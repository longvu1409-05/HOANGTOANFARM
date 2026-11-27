import { Router } from 'express';
import { healthController } from '../controllers/healthController.js';
import { productRoutes } from './productRoutes.js';
import { orderRoutes } from './orderRoutes.js';
import { newsletterRoutes } from './newsletterRoutes.js';
import { contentRoutes } from './contentRoutes.js';

export const apiRouter = Router();

apiRouter.get('/health', healthController.check);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/newsletter', newsletterRoutes);
apiRouter.use('/content', contentRoutes);
