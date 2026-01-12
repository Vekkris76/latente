import { FastifyReply, FastifyRequest } from 'fastify';
import pool from '../../../infrastructure/database/client';
import { randomUUID } from 'crypto';

export class SafetyController {
  async blockUser(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;
    const { blocked_user_id } = request.body as any;

    if (userId === blocked_user_id) {
      return reply.status(400).send({ error: 'Bad Request', message: 'Cannot block yourself' });
    }

    await pool.query(
      'INSERT INTO blocks (id, blocker_user_id, blocked_user_id, created_at) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
      [randomUUID(), userId, blocked_user_id, new Date()]
    );

    return reply.send({ success: true });
  }
}
