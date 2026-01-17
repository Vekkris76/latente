import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/interfaces/http/server';
import { describePostgres } from '../helpers/postgresGate';

describePostgres('Security & Infrastructure E2E', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await createServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('CORS', () => {
    test('debe permitir origin autorizado (app.latentum.app) en producción', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const srv = await createServer();
      const res = await srv.inject({
        method: 'GET',
        url: '/health',
        headers: { origin: 'https://app.latentum.app' }
      });
      expect(res.headers['access-control-allow-origin']).toBe('https://app.latentum.app');
      await srv.close();
      process.env.NODE_ENV = originalEnv;
    });

    test('debe rechazar origin no autorizado en producción', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const srv = await createServer();
      const res = await srv.inject({
        method: 'GET',
        url: '/health',
        headers: { origin: 'https://malicious.com' }
      });
      expect(res.headers['access-control-allow-origin']).toBeUndefined();
      await srv.close();
      process.env.NODE_ENV = originalEnv;
    });

    test('debe permitir localhost en desarrollo', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const srv = await createServer();
      const res = await srv.inject({
        method: 'GET',
        url: '/health',
        headers: { origin: 'http://localhost:5173' }
      });
      expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5173');
      await srv.close();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Rate Limit', () => {
    test('debe devolver 429 al exceder el límite en /auth/request-code', async () => {
      const email = 'rate@limit.com';
      // El límite es 5 por minuto
      for (let i = 0; i < 5; i++) {
        await server.inject({
          method: 'POST',
          url: '/auth/request-code',
          payload: { email }
        });
      }
      const res = await server.inject({
        method: 'POST',
        url: '/auth/request-code',
        payload: { email }
      });
      expect(res.statusCode).toBe(429);
      const body = JSON.parse(res.payload);
      expect(body.error).toBe('Too Many Requests');
    });
  });

  describe('Metrics', () => {
    test('no debe exponer /metrics si ENABLE_METRICS=false', async () => {
      process.env.ENABLE_METRICS = 'false';
      // Re-creamos el server para que tome la env
      const srv = await createServer();
      const res = await srv.inject({
        method: 'GET',
        url: '/metrics'
      });
      expect(res.statusCode).toBe(404);
      await srv.close();
    });

    test('debe exponer /metrics si ENABLE_METRICS=true', async () => {
      process.env.ENABLE_METRICS = 'true';
      const srv = await createServer();
      const res = await srv.inject({
        method: 'GET',
        url: '/metrics'
      });
      expect(res.statusCode).toBe(200);
      expect(res.payload).toContain('http_requests_total');
      await srv.close();
    });
  });
});
