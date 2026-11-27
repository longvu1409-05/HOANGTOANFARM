import { Router } from 'express';
import { newsletterController } from '../controllers/newsletterController';

export const newsletterRoutes = Router();

newsletterRoutes.get('/', newsletterController.list);
newsletterRoutes.post('/', newsletterController.subscribe);
