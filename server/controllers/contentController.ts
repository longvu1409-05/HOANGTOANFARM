import { Request, Response } from 'express';
import { contentRepo } from '../repositories/contentRepo.js';
import { sendBadRequest, sendCreated, sendOk } from '../utils/response.js';

export const contentController = {
  listReviews(_req: Request, res: Response) {
    const reviews = contentRepo.getAllReviews();
    return sendOk(res, reviews);
  },

  createReview(req: Request, res: Response) {
    const author = String(req.body?.author ?? '').trim();
    const quote = String(req.body?.quote ?? '').trim();
    const rating = Number(req.body?.rating ?? 5);

    if (author.length < 2 || quote.length < 5) {
      return sendBadRequest(res, 'Vui lòng nhập đầy đủ tên và nội dung đánh giá.');
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return sendBadRequest(res, 'Số sao đánh giá phải từ 1 đến 5.');
    }

    const created = contentRepo.createReview(author, quote, rating);
    return sendCreated(res, created, 'Cảm ơn bạn đã gửi đánh giá cho Hoàng Toàn Farm!');
  },

  listKnowledge(_req: Request, res: Response) {
    const articles = contentRepo.getAllKnowledgeArticles();
    return sendOk(res, articles);
  },
};
