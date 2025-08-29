import Post from '../models/Post.js';
import catchAsync from '../utils/catchAsync.js';
import ApiError from '../utils/ApiError.js';

// Create Post
export const createPost = catchAsync(async (req, res) => {
  const { title, content, tags = [] } = req.body;
  const post = await Post.create({ title, content, tags, author: req.user._id });
  res.status(201).json({ success: true, post });
});

// Get Posts (with filtering + pagination)
export const getPosts = catchAsync(async (req, res) => {
  const {
    author,          // user id
    tag,             // single tag
    from,            // ISO date
    to,              // ISO date
    search,          // keyword in title/content
    sort = '-createdAt',
    page = 1,
    limit = 10,
  } = req.query;

  const filter = {};
  if (author) filter.author = author;
  if (tag) filter.tags = tag;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { content: new RegExp(search, 'i') },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [items, total] = await Promise.all([
    Post.find(filter)
      .populate('author', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Post.countDocuments(filter),
  ]);

  res.json({
    success: true,
    meta: {
      totalItems: total,
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit) || 1),
    },
    items,
  });
});

// Get single Post
export const getPostById = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');
  if (!post) throw new ApiError(404, 'Post not found');
  res.json({ success: true, post });
});

// Update Post (owner or admin)
export const updatePost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');

  const updatable = ['title', 'content', 'tags'];
  updatable.forEach((k) => {
    if (req.body[k] !== undefined) post[k] = req.body[k];
  });

  await post.save();
  res.json({ success: true, post });
});

// Delete Post (owner or admin)
export const deletePost = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new ApiError(404, 'Post not found');

  const isOwner = post.author.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw new ApiError(403, 'Forbidden');

  await post.deleteOne();
  res.status(204).send();
});
