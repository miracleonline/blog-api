import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  addComment,
  listComments,
  deleteComment,
} from '../controllers/commentController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router({ mergeParams: true });

// Public: GET /api/posts/:postId/comments
router.get(
  '/',
  validate([param('postId').isMongoId()]),
  listComments
);

// Auth: POST /api/posts/:postId/comments
router.post(
  '/',
  requireAuth,
  validate([
    param('postId').isMongoId(),
    body('content').trim().notEmpty().isLength({ max: 500 }),
  ]),
  addComment
);

// Auth: DELETE /api/comments/:id
// (mounted separately as /api/comments/:id)
export const commentIdRouter = Router();
commentIdRouter.delete(
  '/:id',
  requireAuth,
  validate([param('id').isMongoId()]),
  deleteComment
);

export default router;
