import { createExpressApp } from './config/express';
import { routes } from './routes';
import { errorHandler } from './middleware/error';
import { env } from './config/env';
import { logger } from './utils/logger';

async function startServer() {
  const app = createExpressApp();

  // Routes
  app.use('/api', routes);

  // Error handling
  app.use(errorHandler);

  app.listen(env.port, () => {
    logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
}

export default startServer;
