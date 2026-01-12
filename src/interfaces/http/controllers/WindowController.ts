import { FastifyReply, FastifyRequest } from 'fastify';
import pool from '../../../infrastructure/database/client';
import { randomUUID } from 'crypto';

export class WindowController {
  async makeDecision(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const windowId = (request.params as any).id;
    const { decision } = request.body as any;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Concurrencia obligatoria: SELECT FOR UPDATE
      const res = await client.query(
        'SELECT * FROM sync_windows WHERE window_id = $1 FOR UPDATE',
        [windowId]
      );

      if (res.rows.length === 0) {
        await client.query('ROLLBACK');
        return reply.status(404).send({ error: 'Not Found', message: 'Window not found' });
      }

      const window = res.rows[0];

      // Verificar que el usuario pertenece a la ventana
      if (window.user_a_id !== userId && window.user_b_id !== userId) {
        await client.query('ROLLBACK');
        return reply.status(403).send({ error: 'Forbidden', message: 'User not part of this window' });
      }

      if (window.window_status === 'activated' || window.window_status === 'declined' || window.window_status === 'expired') {
        await client.query('ROLLBACK');
        return reply.status(400).send({ error: 'Bad Request', message: 'Window already closed' });
      }

      if (decision === 'decline') {
        await client.query(
          'UPDATE sync_windows SET window_status = $1, declined_by = $2 WHERE window_id = $3',
          ['declined', userId, windowId]
        );
      } else {
        // Accept
        let newStatus = window.window_status;
        let acceptA = window.accept_a;
        let acceptB = window.accept_b;

        if (window.user_a_id === userId) {
          acceptA = true;
          newStatus = acceptB ? 'activated' : 'accepted_by_a';
        } else {
          acceptB = true;
          newStatus = acceptA ? 'activated' : 'accepted_by_b';
        }

        await client.query(
          'UPDATE sync_windows SET window_status = $1, accept_a = $2, accept_b = $3 WHERE window_id = $4',
          [newStatus, acceptA, acceptB, windowId]
        );

        // Si se activa, crear ActiveWindow
        if (newStatus === 'activated') {
          await client.query(
            'INSERT INTO active_windows (id, proposal_id, user_a_id, user_b_id, start_time, end_time, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [randomUUID(), windowId, window.user_a_id, window.user_b_id, new Date(), new Date(Date.now() + 60 * 60 * 1000), 'active', new Date()]
          );
        }
      }

      await client.query('COMMIT');
      return reply.send({ success: true });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
