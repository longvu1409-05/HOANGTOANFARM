import { Router } from 'express';
import { contactController } from '../controllers/contactController';

export const contactRoutes = Router();

contactRoutes.get('/', contactController.list);
contactRoutes.post('/', contactController.create);
contactRoutes.patch('/:id/status', contactController.updateStatus);
