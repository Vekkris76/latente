import { FastifyReply, FastifyRequest } from 'fastify';
import pool from '../../../infrastructure/database/client';

export class AccountController {
  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const userId = (request.user as any).id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Marcar usuario como eliminado
      await client.query(
        'UPDATE users SET account_status = $1 WHERE user_id = $2',
        ['deleted', userId]
      );

      // 2. Revocar sesiones
      await client.query(
        'UPDATE auth_sessions SET revoked = TRUE WHERE user_id = $1',
        [userId]
      );

      // 3. Eliminar credenciales (PII)
      await client.query(
        'DELETE FROM user_credentials WHERE user_id = $1',
        [userId]
      );

      // Nota: El borrado físico de otros datos se delega al PurgeService (Fase 2)
      // o se mantiene según las reglas de retención.

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
