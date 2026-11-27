import { Router } from 'express';
import { newsletterController } from '../controllers/newsletterController.js';
import { requireAdmin } from '../utils/adminAuth.js';

export const newsletterRoutes = Router();

newsletterRoutes.get('/', requireAdmin, newsletterController.list);
newsletterRoutes.post('/', newsletterController.subscribe);
newsletterRoutes.post('/broadcast', requireAdmin, newsletterController.broadcast);
newsletterRoutes.delete('/:id', requireAdmin, newsletterController.remove);
