import { Pool } from 'pg';
import { Recognition, RecognitionStatus } from '../../../domain/models/Recognition';
import { IRepository } from '../../../application/ports/IRepository';

export class PostgresRecognitionRepository implements IRepository<Recognition> {
  constructor(private pool: Pool) {}

  async save(recognition: Recognition): Promise<Recognition> {
    const query = `
      INSERT INTO recognitions (id, active_window_id, user_id, created_at, status)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status
      RETURNING *;
    `;
    const values = [
      recognition.id,
      recognition.active_window_id,
      recognition.user_id,
      recognition.created_at,
      recognition.status
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<Recognition | null> {
    const res = await this.pool.query('SELECT * FROM recognitions WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findByWindow(windowId: string): Promise<Recognition[]> {
    const res = await this.pool.query('SELECT * FROM recognitions WHERE active_window_id = $1', [windowId]);
    return res.rows.map(row => this.mapToEntity(row));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM recognitions WHERE user_id = $1', [userId]);
  }

  private mapToEntity(row: any): Recognition {
    return {
      id: row.id,
      active_window_id: row.active_window_id,
      user_id: row.user_id,
      created_at: new Date(row.created_at),
      status: row.status as RecognitionStatus
    };
  }
}
