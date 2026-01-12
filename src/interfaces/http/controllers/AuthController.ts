import { FastifyReply, FastifyRequest } from 'fastify';
import pool from '../../../infrastructure/database/client';
import { randomUUID } from 'crypto';

export class AuthController {
  async requestCode(request: FastifyRequest, reply: FastifyReply) {
    const { email } = request.body as any;
    const code = '123456'; // En producción esto se generaría y enviaría por email
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // Upsert user and credentials (simplificado para MVP)
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Buscar o crear usuario
      let userRes = await client.query('SELECT user_id FROM user_credentials WHERE email = $1', [email]);
      let userId: string;

      if (userRes.rows.length === 0) {
        userId = randomUUID();
        await client.query(
          'INSERT INTO users (user_id, name, age, observation_active, account_status, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
          [userId, 'User', 0, true, 'active', new Date()]
        );
        await client.query(
          'INSERT INTO user_credentials (user_id, email, verification_code_hash, code_expires_at) VALUES ($1, $2, $3, $4)',
          [userId, email, code, expiresAt]
        );
      } else {
        userId = userRes.rows[0].user_id;
        await client.query(
          'UPDATE user_credentials SET verification_code_hash = $1, code_expires_at = $2, updated_at = NOW() WHERE user_id = $3',
          [code, expiresAt, userId]
        );
      }

      await client.query('COMMIT');
      return reply.send({ success: true, message: 'Code sent' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async verifyCode(request: FastifyRequest, reply: FastifyReply) {
    const { email, code } = request.body as any;

    const res = await pool.query(
      'SELECT user_id FROM user_credentials WHERE email = $1 AND verification_code_hash = $2 AND code_expires_at > NOW()',
      [email, code]
    );

    if (res.rows.length === 0) {
      return reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired code' });
    }

    const userId = res.rows[0].user_id;
    const accessToken = await reply.jwtSign({ id: userId });
    const refreshToken = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await pool.query(
      'INSERT INTO auth_sessions (user_id, refresh_token_hash, expires_at) VALUES ($1, $2, $3)',
      [userId, refreshToken, expiresAt]
    );

    // Obtener datos básicos del usuario (sin PII)
    const userRes = await pool.query('SELECT user_id, age, observation_active, account_status, created_at FROM users WHERE user_id = $1', [userId]);

    return reply.send({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: userRes.rows[0]
    });
  }

  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const { refresh_token } = request.body as any;

    const res = await pool.query(
      'SELECT user_id FROM auth_sessions WHERE refresh_token_hash = $1 AND revoked = FALSE AND expires_at > NOW()',
      [refresh_token]
    );

    if (res.rows.length === 0) {
      return reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired refresh token' });
    }

    const userId = res.rows[0].user_id;
    const accessToken = await reply.jwtSign({ id: userId });

    return reply.send({ access_token: accessToken });
  }
}
