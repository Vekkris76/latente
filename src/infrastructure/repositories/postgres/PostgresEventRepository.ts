import { Pool } from 'pg';
import { AbstractEvent } from '../../../domain/types/AbstractEvent.types';
import { IRepository } from '../../../application/ports/IRepository';
import { TimeBucket, PlaceCategory, DayType, DurationBucket, AbstractEventStatus } from '../../../domain/types/enums';

export class PostgresEventRepository implements IRepository<AbstractEvent> {
  constructor(private pool: Pool) {}

  async save(event: AbstractEvent): Promise<AbstractEvent> {
    const query = `
      INSERT INTO abstract_events (id, user_id, time_bucket, place_category, day_type, duration_bucket, week_id, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status
      RETURNING *;
    `;
    const values = [
      event.id,
      event.user_id,
      event.time_bucket,
      event.place_category,
      event.day_type,
      event.duration_bucket,
      event.week_id,
      event.status,
      event.created_at
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<AbstractEvent | null> {
    const res = await this.pool.query('SELECT * FROM abstract_events WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findAllByUser(userId: string): Promise<AbstractEvent[]> {
    const res = await this.pool.query('SELECT * FROM abstract_events WHERE user_id = $1', [userId]);
    return res.rows.map(row => this.mapToEntity(row));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM abstract_events WHERE user_id = $1', [userId]);
  }

  private mapToEntity(row: any): AbstractEvent {
    return {
      id: row.id,
      user_id: row.user_id,
      time_bucket: row.time_bucket as TimeBucket,
      place_category: row.place_category as PlaceCategory,
      day_type: row.day_type as DayType,
      duration_bucket: row.duration_bucket as DurationBucket,
      week_id: row.week_id,
      status: row.status as AbstractEventStatus,
      created_at: new Date(row.created_at)
    };
  }
}
