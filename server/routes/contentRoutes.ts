import { Router } from 'express';
import { contentController } from '../controllers/contentController.js';
import { requireAdmin } from '../utils/adminAuth.js';

export const contentRoutes = Router();

contentRoutes.get('/reviews', contentController.listReviews);
contentRoutes.post('/reviews', contentController.createReview);
contentRoutes.get('/knowledge', contentController.listKnowledge);
contentRoutes.get('/knowledge/:id', contentController.getKnowledgeById);
contentRoutes.post('/knowledge', requireAdmin, contentController.createKnowledge);
