import { Router } from 'express';
import { contentController } from '../controllers/contentController.js';

export const contentRoutes = Router();

contentRoutes.get('/reviews', contentController.listReviews);
contentRoutes.post('/reviews', contentController.createReview);
contentRoutes.get('/knowledge', contentController.listKnowledge);
