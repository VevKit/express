import { env } from "@/config/env";
import cors from 'cors';

export const corsMiddleware = cors({
  origin: env.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600 // 10 minutes
});