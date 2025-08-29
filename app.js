import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';

import { config } from './config/index.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// Security & core middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
if (config.env !== 'test') app.use(morgan('dev'));

// Simple rate limit 
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Healthcheck
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404/error
app.use(notFound);
app.use(errorHandler);

export default app;
