import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/types';
import { logger } from '@/utils/logger';
import { env } from '@/config/env';
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.nodeEnv === 'development') {
    logger.error('Error', {
      status: err.status,
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack
    });

    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    logger.error('Error', {
      status: err.status,
      statusCode: err.statusCode,
      message: err.message
    });

    res.status(err.statusCode).json({
      status: err.status,
      message: err.isOperational ? err.message : 'Internal server error'
    });
  }
}