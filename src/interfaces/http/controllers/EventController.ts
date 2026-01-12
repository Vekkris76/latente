import { FastifyReply, FastifyRequest } from 'fastify';
import pool from '../../../infrastructure/database/client';
import { randomUUID } from 'crypto';
import { getCurrentWeekId } from '../../../utils/weekIdUtils';

export class EventController {
  async ingestEvent(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const idempotencyKey = request.headers['x-idempotency-key'] as string;
    const { time_bucket, place_category, day_type, duration_bucket } = request.body as any;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Verificar idempotencia
      const idemRes = await client.query(
        'SELECT status_code, response_body FROM idempotency_records WHERE user_id = $1 AND idempotency_key = $2',
        [userId, idempotencyKey]
      );

      if (idemRes.rows.length > 0) {
        await client.query('ROLLBACK');
        const { status_code, response_body } = idemRes.rows[0];
        return reply.status(status_code).send(response_body);
      }

      // 2. Procesar evento
      const eventId = randomUUID();
      const weekId = getCurrentWeekId();
      const createdAt = new Date();

      const insertRes = await client.query(
        'INSERT INTO abstract_events (id, user_id, time_bucket, place_category, day_type, duration_bucket, week_id, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [eventId, userId, time_bucket, place_category, day_type, duration_bucket, weekId, 'pending', createdAt]
      );

      const responseBody = insertRes.rows[0];
      const statusCode = 201;

      // 3. Registrar idempotencia
      await client.query(
        'INSERT INTO idempotency_records (user_id, idempotency_key, status_code, response_body) VALUES ($1, $2, $3, $4)',
        [userId, idempotencyKey, statusCode, responseBody]
      );

      await client.query('COMMIT');
      return reply.status(statusCode).send(responseBody);
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
