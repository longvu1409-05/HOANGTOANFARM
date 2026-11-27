import { Router } from 'express';
import { newsletterController } from '../controllers/newsletterController.js';

export const newsletterRoutes = Router();

newsletterRoutes.get('/', newsletterController.list);
newsletterRoutes.post('/', newsletterController.subscribe);
