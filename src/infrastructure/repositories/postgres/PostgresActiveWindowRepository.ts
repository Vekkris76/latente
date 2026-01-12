import { Pool } from 'pg';
import { ActiveWindow, ActiveWindowStatus } from '../../../domain/models/ActiveWindow';
import { IRepository } from '../../../application/ports/IRepository';

export class PostgresActiveWindowRepository implements IRepository<ActiveWindow> {
  constructor(private pool: Pool) {}

  async save(window: ActiveWindow): Promise<ActiveWindow> {
    // Normalización A < B
    const [uA, uB] = window.user_a_id < window.user_b_id ? [window.user_a_id, window.user_b_id] : [window.user_b_id, window.user_a_id];

    const query = `
      INSERT INTO active_windows (id, proposal_id, user_a_id, user_b_id, start_time, end_time, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status
      RETURNING *;
    `;
    const values = [
      window.id,
      window.proposal_id,
      uA,
      uB,
      window.start_time,
      window.end_time,
      window.status,
      window.created_at
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<ActiveWindow | null> {
    const res = await this.pool.query('SELECT * FROM active_windows WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findActiveByUser(userId: string, now: Date): Promise<ActiveWindow | null> {
    const res = await this.pool.query(
      `SELECT * FROM active_windows 
       WHERE (user_a_id = $1 OR user_b_id = $1) 
       AND status = 'active' 
       AND $2 >= start_time AND $2 <= end_time`,
      [userId, now]
    );
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.pool.query('DELETE FROM active_windows WHERE id = $1', [id]);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM active_windows WHERE user_a_id = $1 OR user_b_id = $1', [userId]);
  }

  async findAll(): Promise<ActiveWindow[]> {
    const res = await this.pool.query('SELECT * FROM active_windows');
    return res.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): ActiveWindow {
    return {
      id: row.id,
      proposal_id: row.proposal_id,
      user_a_id: row.user_a_id,
      user_b_id: row.user_b_id,
      start_time: new Date(row.start_time),
      end_time: new Date(row.end_time),
      status: row.status as ActiveWindowStatus,
      created_at: new Date(row.created_at)
    };
  }
}
