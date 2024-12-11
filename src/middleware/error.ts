import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, TimeoutError, ValidationError } from '@/types/error';
import { logger } from '@/utils/logger';
import { env } from '@/config/env';

function handleZodError(err: ZodError): ValidationError {
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
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  let error = err;

  // Transform known errors
  if (err instanceof ZodError) {
    const zodError = handleZodError(err);
    logger.warning('Validation error', {
      errors: zodError.errors
    });
    res.status(zodError.statusCode).json({
      status: zodError.status,
      message: zodError.message,
      errors: zodError.errors
    });
  }

  if (error instanceof TimeoutError) {
    logger.warning('Request timeout occurred', {
      path: req.path,
      method: req.method,
      operationName: error.operationName,
      timeoutMs: error.timeoutMs
    });

    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      ...(env.nodeEnv === 'development' && {
        operationName: error.operationName,
        timeoutMs: error.timeoutMs
      })
    });
  }

  // Send response
  if (error instanceof AppError) {
    logger.warning(error.message, {
      statusCode: error.statusCode,
      status: error.status,
      ...(error instanceof ValidationError && { errors: error.errors })
    });
  
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