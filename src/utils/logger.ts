import { env } from '@/config/env';
import { Logger } from '@vevkit/saga';

export const logger = new Logger({
  level: env.nodeEnv === 'development' ? 'debug' : 'info'
});