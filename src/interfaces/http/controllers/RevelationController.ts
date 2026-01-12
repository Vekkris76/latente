import { FastifyReply, FastifyRequest } from 'fastify';
import pool from '../../../infrastructure/database/client';
import { randomUUID } from 'crypto';

export class RevelationController {
  async getActiveRevelations(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;

    const res = await pool.query(
      'SELECT id, pattern_summary, revealed_at, expires_at, status FROM revelations WHERE (user_a_id = $1 OR user_b_id = $1) AND status = $2 AND expires_at > NOW()',
      [userId, 'active']
    );

    return reply.send(res.rows);
  }

  async sendMessage(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { revelationId } = request.params as any;
    const { content } = request.body as any;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Verificar que la revelación existe y el usuario pertenece a ella
      const revRes = await client.query(
        'SELECT * FROM revelations WHERE id = $1 AND (user_a_id = $2 OR user_b_id = $2) AND status = $3 AND expires_at > NOW()',
        [revelationId, userId, 'active']
      );

      if (revRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return reply.status(403).send({ error: 'Forbidden', message: 'Revelation not found or expired, or user not part of it' });
      }

      // 2. Guardar mensaje
      const messageId = randomUUID();
      const sentAt = new Date();
      await client.query(
        'INSERT INTO conversation_messages (id, revelation_id, sender_id, content, sent_at) VALUES ($1, $2, $3, $4, $5)',
        [messageId, revelationId, userId, content, sentAt]
      );

      await client.query('COMMIT');
      return reply.status(201).send({ id: messageId, sent_at: sentAt });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getMessages(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { revelationId } = request.params as any;

    // 1. Verificar pertenencia
    const revRes = await pool.query(
      'SELECT * FROM revelations WHERE id = $1 AND (user_a_id = $2 OR user_b_id = $2)',
      [revelationId, userId]
    );

    if (revRes.rows.length === 0) {
      return reply.status(403).send({ error: 'Forbidden', message: 'User not part of this revelation' });
    }

    // 2. Obtener mensajes
    const res = await pool.query(
      'SELECT id, revelation_id, sender_id, content, sent_at FROM conversation_messages WHERE revelation_id = $1 ORDER BY sent_at ASC',
      [revelationId]
    );

    return reply.send(res.rows);
  }
}
