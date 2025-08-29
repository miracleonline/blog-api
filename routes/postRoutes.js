import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

// Public: GET /api/posts (pagination & filtering)
router.get(
  '/',
  validate([
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('author').optional().isMongoId(),
    query('tag').optional().isString(),
    query('search').optional().isString(),
  ]),
  getPosts
);

// Public: GET /api/posts/:id
router.get(
  '/:id',
  validate([param('id').isMongoId()]),
  getPostById
);

// Auth: POST /api/posts
router.post(
  '/',
  requireAuth,
  validate([
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    body('tags').optional().isArray(),
  ]),
  createPost
);

// Auth: PATCH /api/posts/:id
router.patch(
  '/:id',
  requireAuth,
  validate([
    param('id').isMongoId(),
    body('title').optional().isString(),
    body('content').optional().isString(),
    body('tags').optional().isArray(),
  ]),
  updatePost
);

// Auth: DELETE /api/posts/:id
router.delete(
  '/:id',
  requireAuth,
  validate([param('id').isMongoId()]),
  deletePost
);

export default router;
