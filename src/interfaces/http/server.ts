import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyJwt from '@fastify/jwt';

import { authRoutes } from './routes/auth';
import { eventRoutes } from './routes/events';
import { windowRoutes } from './routes/windows';
import { recognitionRoutes } from './routes/recognitions';
import { revelationRoutes } from './routes/revelations';
import { safetyRoutes } from './routes/safety';
import { accountRoutes } from './routes/account';

type MetricsKey = string;

/**
 * Métricas ligeras (sin dependencias):
 * - contador por method + route + status
 * - expone /metrics en formato text/plain (simple)
 */
function createInMemoryMetrics() {
  const counts = new Map<MetricsKey, number>();

  function inc(method: string, route: string, status: number) {
    const key = `${method} ${route} ${status}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  function render(): string {
    const lines: string[] = [];
    lines.push(`# latentum_metrics_v1`);
    lines.push(`# HELP http_requests_total Total HTTP requests (method route status)`);
    lines.push(`# TYPE http_requests_total counter`);
    for (const [key, value] of counts.entries()) {
      lines.push(`http_requests_total{key="${key.replace(/\\/g, '\\\\').replace(/\"/g, '\\"')}"} ${value}`);
    }
    return lines.join('\n') + '\n';
  }

  return { inc, render };
}

async function buildServer() {
  const server = fastify({ 
    logger: true,
    ajv: {
      customOptions: {
        removeAdditional: false,
        useDefaults: true,
        coerceTypes: true,
        allErrors: true
      }
    }
  });

  // --- JWT (OBLIGATORIO para que existan reply.jwtSign / request.jwtVerify tipados)
  const jwtSecret = process.env.JWT_SECRET?.trim();
  if (!jwtSecret || jwtSecret.length < 32) {
    // Fail-safe en runtime: en prod no queremos un secret corto o vacío.
    // En dev puedes poner uno largo en .env
    throw new Error('JWT_SECRET is missing or too short (min 32 chars).');
  }

  await server.register(fastifyJwt, {
    secret: jwtSecret
  });

  // --- CORS tightening
  const corsOrigin = process.env.CORS_ORIGIN?.trim();
  const isProd = process.env.NODE_ENV === 'production';
  
  // Whitelist estricta deduplicada
  const allowedOrigins = new Set(['https://app.latentum.app']);
  if (corsOrigin) allowedOrigins.add(corsOrigin);

  await server.register(fastifyCors, {
    origin: (origin, cb) => {
      // En producción, lista blanca estricta
      if (isProd) {
        if (origin && allowedOrigins.has(origin)) {
          cb(null, true);
        } else {
          // No origin o no permitido -> No emitir cabecera
          cb(null, false);
        }
        return;
      }

      // En desarrollo, permitir localhost y whitelist
      if (!origin || origin.startsWith('http://localhost:') || allowedOrigins.has(origin)) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    credentials: true
  });

  // --- Rate limit global
  await server.register(fastifyRateLimit, {
    global: true,
    max: Number(process.env.RL_GLOBAL_MAX ?? 100),
    timeWindow: process.env.RL_GLOBAL_WINDOW ?? '1 minute',
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: (request, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${context.after}.`,
      date: new Date(),
      expiresIn: context.after
    })
  });

  // --- Metrics (in-memory)
  const metrics = createInMemoryMetrics();
  const enableMetrics = process.env.ENABLE_METRICS === 'true';

  server.addHook('onResponse', async (req, reply) => {
    if (!enableMetrics) return;
    const route =
      (req.routeOptions && typeof req.routeOptions.url === 'string' && req.routeOptions.url) ||
      (req.raw.url ? req.raw.url.split('?')[0] : 'unknown');

    metrics.inc(req.method, route, reply.statusCode);
  });

  if (enableMetrics) {
    server.get('/metrics', async (_req, reply) => {
      reply.header('Content-Type', 'text/plain; charset=utf-8');
      return metrics.render();
    });
  }

  server.get('/health', async () => ({ status: 'ok' }));

  // --- Routes
  await server.register(authRoutes, { prefix: '/auth' });
  await server.register(eventRoutes, { prefix: '/events' });
  await server.register(windowRoutes, { prefix: '/windows' });
  await server.register(recognitionRoutes, { prefix: '/recognitions' });
  await server.register(revelationRoutes, { prefix: '/revelations' });
  await server.register(safetyRoutes, { prefix: '/safety' });
  await server.register(accountRoutes, { prefix: '/account' });

  return server;
}

// Test-friendly factory (does NOT listen).
export async function createServer() {
  return buildServer();
}

// Also export for advanced usage (optional)
export { buildServer };

async function main() {
  const server = await buildServer();
  const port = Number(process.env.PORT ?? 3000);
  const host = '0.0.0.0';
  try {
    await server.listen({ port, host });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// Only run if this file is the main entry point
if (require.main === module) {
  main();
}
