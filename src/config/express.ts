import express, { Express } from 'express';

import hpp from 'hpp';
import compression from 'compression';

import { helmetMiddleware } from '@/middleware/helmet';
import { corsMiddleware } from '@/middleware/cors';
import { rateLimiter } from '@/middleware/rate-limit';
import { requestSizeLimiter } from '@/middleware/rate-limit';
import { requestTimeout } from '@/middleware/rate-limit';

export function createExpressApp() {
  const app: Express = express();

  // Security middleware
  app.use(helmetMiddleware);

  // CORS middleware
  app.use(corsMiddleware);

  // Body parser middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request parsing & security
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(hpp()); // Prevent HTTP Parameter Pollution
  app.use(compression()); // Compress responses

  // Custom security middleware
  app.use(rateLimiter);
  app.use(requestSizeLimiter);
  app.use(requestTimeout);

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });
  
  return app;
}