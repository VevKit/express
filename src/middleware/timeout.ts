import { Request, Response, NextFunction } from 'express';
import { TimeoutError } from '@/types/error';
import { logger } from '@/utils/logger';

interface TimeoutOptions {
  timeout?: number;        // Timeout in milliseconds
  enableHeader?: boolean;  // Whether to include timeout header
  operations?: {          // Operation-specific timeouts
    [key: string]: number;
  };
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

export function timeoutHandler(options: TimeoutOptions = {}) {
  const {
    timeout = DEFAULT_TIMEOUT,
    enableHeader = true,
    operations = {}
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Get operation-specific timeout or default
    const operationName = req.get('X-Operation-Name');
    const timeoutMs = operationName && operations[operationName]
      ? operations[operationName]
      : timeout;

    // Add timeout header if enabled
    if (enableHeader) {
      res.set('X-Timeout-Value', timeoutMs.toString());
    }

    // Create timeout handler
    const timeoutId = setTimeout(() => {
      logger.warning('Request timeout', {
        path: req.path,
        method: req.method,
        operationName,
        timeoutMs
      });

      const error = new TimeoutError(
        'Request timed out',
        operationName,
        timeoutMs
      );
      
      next(error);
    }, timeoutMs);

    // Clear timeout on response finish
    res.on('finish', () => {
      clearTimeout(res);
    });

    // Store timeout ID for potential early clearing
    res.locals.timeoutId = timeoutId;

    next();
  };
}

// Utility to clear timeout early (useful for streaming responses)
export function clearTimeout(res: Response) {
  if (res.locals.timeoutId) {
    clearTimeout(res);
    delete res.locals.timeoutId;
  }
}