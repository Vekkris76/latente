import { FastifyReply, FastifyRequest } from 'fastify';
import pool from '../../../infrastructure/database/client';
import { randomUUID } from 'crypto';

export class RecognitionController {
  async createRecognition(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { active_window_id } = request.body as any;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Verificar que la ventana activa existe y el usuario pertenece a ella
      const windowRes = await client.query(
        'SELECT * FROM active_windows WHERE id = $1 AND (user_a_id = $2 OR user_b_id = $2) AND status = $3',
        [active_window_id, userId, 'active']
      );

      if (windowRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return reply.status(404).send({ error: 'Not Found', message: 'Active window not found or not active' });
      }

      // 2. Crear reconocimiento
      await client.query(
        'INSERT INTO recognitions (id, active_window_id, user_id, created_at, status) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [randomUUID(), active_window_id, userId, new Date(), 'confirmed']
      );

      // 3. Verificar si ambos han reconocido para crear revelación
      const recognitionsRes = await client.query(
        'SELECT user_id FROM recognitions WHERE active_window_id = $1',
        [active_window_id]
      );

      if (recognitionsRes.rows.length === 2) {
        const window = windowRes.rows[0];
        // Crear revelación
        await client.query(
          'INSERT INTO revelations (id, active_window_id, user_a_id, user_b_id, pattern_summary, revealed_at, expires_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
          [
            randomUUID(),
            active_window_id,
            window.user_a_id,
            window.user_b_id,
            'Shared pattern detected', // Simplificado
            new Date(),
            new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
            'active'
          ]
        );
        // Marcar ventana como completada
        await client.query('UPDATE active_windows SET status = $1 WHERE id = $2', ['completed', active_window_id]);
      }

      await client.query('COMMIT');
      return reply.status(201).send({ success: true });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
