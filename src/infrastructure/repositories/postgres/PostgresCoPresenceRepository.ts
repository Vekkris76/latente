import { Pool } from 'pg';
import { LatentCoPresence } from '../../../domain/models/LatentCoPresence';
import { LatentCoPresenceStatus, PlaceCategory, TimeBucket } from '../../../domain/types/enums';
import { IRepository } from '../../../application/ports/IRepository';

export class PostgresCoPresenceRepository implements IRepository<LatentCoPresence> {
  constructor(private pool: Pool) {}

  async save(cp: LatentCoPresence): Promise<LatentCoPresence> {
    // Normalización A < B
    const [uA, uB] = cp.user_a_id < cp.user_b_id ? [cp.user_a_id, cp.user_b_id] : [cp.user_b_id, cp.user_a_id];
    const [pA, pB] = cp.user_a_id < cp.user_b_id ? [cp.pattern_id_a, cp.pattern_id_b] : [cp.pattern_id_b, cp.pattern_id_a];

    const query = `
      INSERT INTO latent_copresences (
        copresence_id, user_a_id, user_b_id, pattern_id_a, pattern_id_b,
        shared_place_category, shared_time_bucket, overlap_week_ids, status, detected_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (copresence_id) DO UPDATE SET
        status = EXCLUDED.status
      RETURNING *;
    `;
    const values = [
      cp.copresence_id,
      uA,
      uB,
      pA,
      pB,
      cp.shared_place_category,
      cp.shared_time_bucket,
      cp.overlap_week_ids,
      cp.status,
      cp.detected_at
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<LatentCoPresence | null> {
    const res = await this.pool.query('SELECT * FROM latent_copresences WHERE copresence_id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findActiveByUser(userId: string): Promise<LatentCoPresence[]> {
    const res = await this.pool.query(
      'SELECT * FROM latent_copresences WHERE (user_a_id = $1 OR user_b_id = $1) AND status = $2',
      [userId, LatentCoPresenceStatus.DETECTED]
    );
    return res.rows.map(row => this.mapToEntity(row));
  }

  async existsActiveBetween(userA: string, userB: string, category: string, bucket: string): Promise<boolean> {
    const [uA, uB] = userA < userB ? [userA, userB] : [userB, userA];
    const res = await this.pool.query(
      `SELECT 1 FROM latent_copresences 
       WHERE user_a_id = $1 AND user_b_id = $2 
       AND shared_place_category = $3 AND shared_time_bucket = $4 
       AND status = $5`,
      [uA, uB, category, bucket, LatentCoPresenceStatus.DETECTED]
    );
    return res.rows.length > 0;
  }

  async findByPairAndPattern(userA: string, userB: string, category: string, bucket: string): Promise<LatentCoPresence | null> {
    const [uA, uB] = userA < userB ? [userA, userB] : [userB, userA];
    const res = await this.pool.query(
      `SELECT * FROM latent_copresences 
       WHERE user_a_id = $1 AND user_b_id = $2 
       AND shared_place_category = $3 AND shared_time_bucket = $4`,
      [uA, uB, category, bucket]
    );
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async markInactive(id: string): Promise<void> {
    await this.pool.query(
      'UPDATE latent_copresences SET status = $1 WHERE copresence_id = $2',
      [LatentCoPresenceStatus.EXPIRED, id]
    );
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM latent_copresences WHERE user_a_id = $1 OR user_b_id = $1', [userId]);
  }

  private mapToEntity(row: any): LatentCoPresence {
    return {
      copresence_id: row.copresence_id,
      user_a_id: row.user_a_id,
      user_b_id: row.user_b_id,
      pattern_id_a: row.pattern_id_a,
      pattern_id_b: row.pattern_id_b,
      shared_place_category: row.shared_place_category as PlaceCategory,
      shared_time_bucket: row.shared_time_bucket as TimeBucket,
      overlap_week_ids: row.overlap_week_ids,
      detected_at: new Date(row.detected_at),
      status: row.status as LatentCoPresenceStatus
    };
  }
}
