import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './env';

export function createExpressApp() {
  const app: Express = express();

  // Basic middleware
  app.use(helmet());
  app.use(cors({
    origin: env.corsOrigin,
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return app;
}