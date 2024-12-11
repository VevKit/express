import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';


// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

// Request size limiter middleware
export function requestSizeLimiter(req: Request, res: Response, next: NextFunction) {
  const MAX_CONTENT_LENGTH = 10 * 1024 * 1024; // 10MB
  if (req.headers['content-length'] && 
      parseInt(req.headers['content-length']) > MAX_CONTENT_LENGTH) {
    return res.status(413).json({
      status: 'error',
      message: 'Request entity too large'
    });
  }
  next();
}

// Request timeout middleware
export function requestTimeout(req: Request, res: Response, next: NextFunction) {
  const timeout = 30000; // 30 seconds
  res.setTimeout(timeout, () => {
    res.status(408).json({
      status: 'error',
      message: 'Request timeout'
    });
  });
  next();
}