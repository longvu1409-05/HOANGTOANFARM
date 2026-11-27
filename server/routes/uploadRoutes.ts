import { Router } from 'express';
import { uploadController } from '../controllers/uploadController.js';
import { requireAdmin } from '../utils/adminAuth.js';

export const uploadRoutes = Router();

uploadRoutes.post('/', requireAdmin, uploadController.uploadImage);
