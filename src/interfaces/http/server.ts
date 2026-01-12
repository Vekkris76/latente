import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyCors from '@fastify/cors';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';

dotenv.config();

export const createServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    logger: {
      level: 'info',
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
            hostname: request.hostname,
            remoteAddress: request.ip
          };
        }
      }
    }
  });

  // Plugins
  await server.register(fastifyCors, {
    origin: true
  });

  await server.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || 'super-secret-key-change-me'
  });

  await server.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    // No persistir ni loguear IP fuera de lo estrictamente necesario para el rate limit en memoria
    keyGenerator: (request) => request.ip
  });

  // AJV Configuration for strict validation
  server.setValidatorCompiler(({ schema }: any) => {
    const Ajv = require('ajv');
    const addFormats = require('ajv-formats');
    const ajv = new Ajv({
      removeAdditional: false,
      useDefaults: true,
      coerceTypes: true,
      allErrors: true,
      strict: true
    });
    addFormats(ajv);
    return ajv.compile(schema);
  });

  // Error Handler
  server.setErrorHandler(errorHandler);

  // Health check
  server.get('/health', async () => {
    return { status: 'ok' };
  });

  // Routes
  const { authRoutes } = await import('./routes/auth');
  const { eventRoutes } = await import('./routes/events');
  const { windowRoutes } = await import('./routes/windows');
  const { recognitionRoutes } = await import('./routes/recognitions');
  const { revelationRoutes } = await import('./routes/revelations');
  const { safetyRoutes } = await import('./routes/safety');
  const { accountRoutes } = await import('./routes/account');

  await server.register(authRoutes, { prefix: '/auth' });
  await server.register(eventRoutes, { prefix: '/events' });
  await server.register(windowRoutes, { prefix: '/windows' });
  await server.register(recognitionRoutes, { prefix: '/recognitions' });
  await server.register(revelationRoutes, { prefix: '/revelations' });
  await server.register(safetyRoutes, { prefix: '/safety' });
  await server.register(accountRoutes, { prefix: '/account' });

  return server;
};

if (require.main === module) {
  (async () => {
    const server = await createServer();
    const port = Number(process.env.PORT) || 3000;
    try {
      await server.listen({ port, host: '0.0.0.0' });
      console.log(`Server listening on port ${port}`);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  })();
}
