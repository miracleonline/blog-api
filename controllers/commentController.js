import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';

// Add comment
export const addComment = catchAsync(async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, 'Post not found');

  const comment = await Comment.create({
    content,
    post: postId,
    author: req.user._id,
  });

  res.status(201).json({ success: true, comment });
});

// List comments for a post (public)
export const listComments = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post: postId })
    .populate('author', 'name email')
    .sort('-createdAt');
  res.json({ success: true, items: comments });
});

// Delete comment (owner or admin)
export const deleteComment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  if (!comment) throw new ApiError(404, 'Comment not found');

  const isOwner = comment.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');

  await comment.deleteOne();
  res.status(204).send();
});
