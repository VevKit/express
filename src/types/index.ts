export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    max: number;
  };
  requestSize: {
    maxContentLength: number;
  };
  timeout: {
    duration: number;
  };
}