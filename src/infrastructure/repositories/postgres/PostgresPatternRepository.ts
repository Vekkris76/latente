import { Pool } from 'pg';
import { Pattern } from '../../../domain/models/Pattern';
import { IRepository } from '../../../application/ports/IRepository';
import { PatternStatus, PlaceCategory, TimeBucket, DayType } from '../../../domain/types/enums';

export class PostgresPatternRepository implements IRepository<Pattern> {
  constructor(private pool: Pool) {}

  async save(pattern: Pattern): Promise<Pattern> {
    const query = `
      INSERT INTO patterns (
        pattern_id, user_id, place_category, time_bucket, day_type, occurrences_count,
        first_week_id, last_week_id, pattern_status, detected_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (pattern_id) DO UPDATE SET
        pattern_status = EXCLUDED.pattern_status,
        occurrences_count = EXCLUDED.occurrences_count,
        last_week_id = EXCLUDED.last_week_id
      RETURNING *;
    `;
    const values = [
      pattern.pattern_id,
      pattern.user_id,
      pattern.place_category,
      pattern.time_bucket,
      pattern.day_type,
      pattern.occurrences_count,
      pattern.first_week_id,
      pattern.last_week_id,
      pattern.pattern_status,
      pattern.detected_at
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<Pattern | null> {
    const res = await this.pool.query('SELECT * FROM patterns WHERE pattern_id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findAllByUser(userId: string): Promise<Pattern[]> {
    const res = await this.pool.query('SELECT * FROM patterns WHERE user_id = $1', [userId]);
    return res.rows.map(row => this.mapToEntity(row));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM patterns WHERE user_id = $1', [userId]);
  }

  async upsertByKey(pattern: Pattern): Promise<Pattern> {
    return this.save(pattern);
  }

  private mapToEntity(row: any): Pattern {
    return {
      pattern_id: row.pattern_id,
      user_id: row.user_id,
      place_category: row.place_category as PlaceCategory,
      time_bucket: row.time_bucket as TimeBucket,
      day_type: row.day_type as DayType,
      occurrences_count: row.occurrences_count,
      first_week_id: row.first_week_id,
      last_week_id: row.last_week_id,
      pattern_status: row.pattern_status as PatternStatus,
      detected_at: new Date(row.detected_at)
    };
  }
}
