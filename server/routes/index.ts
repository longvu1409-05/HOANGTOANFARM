import { Router } from 'express';
import { healthController } from '../controllers/healthController';
import { productRoutes } from './productRoutes';
import { orderRoutes } from './orderRoutes';
import { newsletterRoutes } from './newsletterRoutes';
import { contentRoutes } from './contentRoutes';
import { contactRoutes } from './contactRoutes';

export const apiRouter = Router();

apiRouter.get('/health', healthController.check);
apiRouter.use('/products', productRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/newsletter', newsletterRoutes);
apiRouter.use('/content', contentRoutes);
apiRouter.use('/contacts', contactRoutes);
