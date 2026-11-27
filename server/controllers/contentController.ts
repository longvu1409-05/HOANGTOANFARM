import { Request, Response } from 'express';
import { contentRepo } from '../repositories/contentRepo.js';
import { sendBadRequest, sendCreated, sendNotFound, sendOk } from '../utils/response.js';

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

  getKnowledgeById(req: Request, res: Response) {
    const article = contentRepo.getKnowledgeArticleById(String(req.params.id));
    if (!article) {
      return sendNotFound(res, 'Không tìm thấy bài viết kiến thức.');
    }
    return sendOk(res, article);
  },

  createKnowledge(req: Request, res: Response) {
    const title = String(req.body?.title ?? '').trim();
    const excerpt = String(req.body?.excerpt ?? '').trim();
    const content = String(req.body?.content ?? '').trim();
    const imageFile = String(req.body?.imageFile ?? 'imgRectangle222.png').trim();

    if (title.length < 5 || excerpt.length < 5 || content.length < 10) {
      return sendBadRequest(res, 'Vui lòng nhập đầy đủ tiêu đề, tóm tắt và nội dung bài viết.');
    }

    const created = contentRepo.createKnowledgeArticle({
      title,
      excerpt,
      content,
      imageFile,
    });
    return sendCreated(res, created, `Đã đăng bài viết "${created.title}".`);
  },
};
