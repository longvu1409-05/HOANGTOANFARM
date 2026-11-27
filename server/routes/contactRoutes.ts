import { Router } from 'express';
import { contactController } from '../controllers/contactController.js';
import { requireAdmin } from '../utils/adminAuth.js';

export const contactRoutes = Router();

contactRoutes.get('/', requireAdmin, contactController.list);
contactRoutes.post('/', contactController.create);
contactRoutes.patch('/:id/status', requireAdmin, contactController.updateStatus);
