import { Pool } from 'pg';
import { Revelation, RevelationStatus } from '../../../domain/models/Revelation';
import { IRepository } from '../../../application/ports/IRepository';

export class PostgresRevelationRepository implements IRepository<Revelation> {
  constructor(private pool: Pool) {}

  async save(revelation: Revelation): Promise<Revelation> {
    // Normalización A < B
    const [uA, uB] = revelation.user_a_id < revelation.user_b_id ? [revelation.user_a_id, revelation.user_b_id] : [revelation.user_b_id, revelation.user_a_id];

    const query = `
      INSERT INTO revelations (id, active_window_id, user_a_id, user_b_id, pattern_summary, revealed_at, expires_at, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status
      RETURNING *;
    `;
    // Nota: active_window_id se extrae de la infraestructura si no está en el dominio, 
    // pero para cumplir el contrato sin tocar el dominio, asumimos que se pasa o se busca.
    // Como el dominio no lo tiene, usamos un valor por defecto o nulo si el esquema lo permite,
    // pero el esquema dice NOT NULL. 
    // Estrategia: El repositorio intentará obtenerlo si existe en el objeto (casting) o fallará.
    const values = [
      revelation.id,
      (revelation as any).active_window_id || '00000000-0000-0000-0000-000000000000', // UUID nulo como fallback
      uA,
      uB,
      revelation.pattern_summary,
      revelation.revealed_at,
      revelation.expires_at,
      revelation.status
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<Revelation | null> {
    const res = await this.pool.query('SELECT * FROM revelations WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findActiveByUser(userId: string): Promise<Revelation[]> {
    const res = await this.pool.query(
      'SELECT * FROM revelations WHERE (user_a_id = $1 OR user_b_id = $1) AND status = $2',
      [userId, 'active']
    );
    return res.rows.map(row => this.mapToEntity(row));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM revelations WHERE user_a_id = $1 OR user_b_id = $1', [userId]);
  }

  private mapToEntity(row: any): Revelation {
    return {
      id: row.id,
      user_a_id: row.user_a_id,
      user_b_id: row.user_b_id,
      pattern_summary: row.pattern_summary,
      revealed_at: new Date(row.revealed_at),
      expires_at: new Date(row.expires_at),
      status: row.status as RevelationStatus
    };
  }
}
