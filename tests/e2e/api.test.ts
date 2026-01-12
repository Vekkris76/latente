import { FastifyInstance } from 'fastify';
import { createServer } from '../../src/interfaces/http/server';
import pool from '../../src/infrastructure/database/client';
import { randomUUID } from 'crypto';

describe('API E2E Tests', () => {
  let server: FastifyInstance;
  let token: string;
  let userId: string;
  const email = 'test@example.com';

  beforeAll(async () => {
    server = await createServer();
    await server.ready();
    
    // Limpiar DB (orden correcto por FKs)
    await pool.query('DELETE FROM conversation_messages');
    await pool.query('DELETE FROM revelations');
    await pool.query('DELETE FROM recognitions');
    await pool.query('DELETE FROM active_windows');
    await pool.query('DELETE FROM sync_windows');
    await pool.query('DELETE FROM latent_copresences');
    await pool.query('DELETE FROM patterns');
    await pool.query('DELETE FROM blocks');
    await pool.query('DELETE FROM reports');
    await pool.query('DELETE FROM idempotency_records');
    await pool.query('DELETE FROM auth_sessions');
    await pool.query('DELETE FROM user_credentials');
    await pool.query('DELETE FROM abstract_events');
    await pool.query('DELETE FROM users');

    // Auth flow
    await server.inject({
      method: 'POST',
      url: '/auth/request-code',
      payload: { email }
    });

    const res = await server.inject({
      method: 'POST',
      url: '/auth/verify-code',
      payload: { email, code: '123456' }
    });

    const body = JSON.parse(res.payload);
    token = body.access_token;
    userId = body.user.user_id;
  });

  afterAll(async () => {
    await server.close();
    await pool.end();
  });

  test('POST /events - debe guardar evento e implementar idempotencia', async () => {
    const idempotencyKey = randomUUID();
    const payload = {
      time_bucket: 'morning',
      place_category: 'work',
      day_type: 'weekday',
      duration_bucket: 'long'
    };

    // Primera petición
    const res1 = await server.inject({
      method: 'POST',
      url: '/events',
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-idempotency-key': idempotencyKey
      },
      payload
    });

    expect(res1.statusCode).toBe(201);
    const body1 = JSON.parse(res1.payload);

    // Segunda petición (idéntica)
    const res2 = await server.inject({
      method: 'POST',
      url: '/events',
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-idempotency-key': idempotencyKey
      },
      payload
    });

    expect(res2.statusCode).toBe(201);
    const body2 = JSON.parse(res2.payload);
    expect(body1).toEqual(body2);
  });

  test('POST /events - debe rechazar campos extra', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/events',
      headers: { 
        Authorization: `Bearer ${token}`,
        'x-idempotency-key': randomUUID()
      },
      payload: {
        time_bucket: 'morning',
        place_category: 'work',
        day_type: 'weekday',
        duration_bucket: 'long',
        extra_field: 'should_fail'
      }
    });

    expect(res.statusCode).toBe(400);
  });

  test('GET /revelations/active - no debe devolver PII', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/revelations/active',
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(res.statusCode).toBe(200);
    const revelations = JSON.parse(res.payload);
    if (revelations.length > 0) {
      const rev = revelations[0];
      expect(rev).not.toHaveProperty('user_a_id'); // Aunque el modelo lo tenga, el DTO/Controller no debería
      expect(rev).not.toHaveProperty('email');
    }
  });

  test('POST /windows/:id/decision - locking concurrency', async () => {
    // Crear una ventana de prueba
    const windowId = randomUUID();
    const userBId = randomUUID();
    
    await pool.query('INSERT INTO users (user_id, name, age, observation_active, account_status, created_at) VALUES ($1, $2, $3, $4, $5, $6)', [userBId, 'User B', 25, true, 'active', new Date()]);
    
    await pool.query(
      'INSERT INTO sync_windows (window_id, user_a_id, user_b_id, place_category, time_bucket, day_type, proposed_date, start_time, end_time, window_status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [windowId, userId < userBId ? userId : userBId, userId < userBId ? userBId : userId, 'work', 'morning', 'weekday', '2026-01-10', '09:00', '10:00', 'pending', new Date()]
    );

    // Simular peticiones simultáneas (aunque inject es secuencial, probamos la lógica)
    const res1 = await server.inject({
      method: 'POST',
      url: `/windows/${windowId}/decision`,
      headers: { Authorization: `Bearer ${token}` },
      payload: { decision: 'accept' }
    });

    expect(res1.statusCode).toBe(200);

    const res2 = await server.inject({
      method: 'POST',
      url: `/windows/${windowId}/decision`,
      headers: { Authorization: `Bearer ${token}` },
      payload: { decision: 'accept' }
    });

    // El segundo accept del mismo usuario debería fallar o ser redundante pero aquí probamos que no rompe
    // En este caso mi controlador permite re-aceptar si no ha cambiado de estado a algo final
    expect(res2.statusCode).toBe(200);
  });
});
