import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { apiRouter } from './routes/index';

export function createApp() {
  const app = express();

  // ── Security ─────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server) or from Vercel/localhost
        if (!origin || origin.includes('localhost') || origin.endsWith('.vercel.app') || origin === env.FRONTEND_URL) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // ── Parsing ───────────────────────────────────────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── Logging ───────────────────────────────────────────────────────────────
  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // ── Rate Limiting ─────────────────────────────────────────────────────────
  app.use('/api', rateLimiter);

  // ── Static Files (uploads) ────────────────────────────────────────────────
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // ── Health Check ──────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'indiax-backend' });
  });

  // ── API Routes ────────────────────────────────────────────────────────────
  app.use('/api/v1', apiRouter);

  // ── 404 Handler ───────────────────────────────────────────────────────────
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'The requested endpoint does not exist.' },
    });
  });

  // ── Global Error Handler ──────────────────────────────────────────────────
  app.use(errorHandler);

  return app;
}
