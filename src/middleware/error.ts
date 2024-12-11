import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, ValidationError } from '@/types/error';
import { logger } from '@/utils/logger';
import { env } from '@/config/env';

function handleZodError(err: ZodError) {
  const errors = err.errors.map(e => ({
    field: e.path.join('.'),
    message: e.message
  }));
  return new ValidationError('Validation failed', errors);
}

function handleDuplicateFieldsDB(err: any) {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate value for field: ${field}`;
  return new ValidationError(message, [{
    field,
    message: `${field} already exists`
  }]);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  let error = err;

  // Transform known errors
  if (err instanceof ZodError) {
    error = handleZodError(err);
  }
  // Handle MongoDB duplicate key error (example)
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    error = handleDuplicateFieldsDB(err as any);
  }

  // Log error
  if (error instanceof AppError) {
    logger.warning(error.message, {
      statusCode: error.statusCode,
      status: error.status,
      ...(error instanceof ValidationError && { errors: error.errors })
    });
  } else {
    logger.error('Unhandled error', error);
  }

  // Send response
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      ...(error instanceof ValidationError && { errors: error.errors }),
      ...(env.nodeEnv === 'development' && { stack: error.stack })
    });
  } else {
    // Unhandled errors
    res.status(500).json({
      status: 'error',
      message: env.nodeEnv === 'development' ? error.message : 'Internal server error',
      ...(env.nodeEnv === 'development' && { stack: error.stack })
    });
  }
}