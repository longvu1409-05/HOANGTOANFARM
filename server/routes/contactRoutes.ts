import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';

export const contactRoutes = Router();

contactRoutes.get('/', contactController.list);
contactRoutes.post('/', contactController.create);
contactRoutes.patch('/:id/status', contactController.updateStatus);
