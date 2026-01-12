import { Pool } from 'pg';
import { WindowProposal, WindowProposalStatus } from '../../../domain/models/WindowProposal';
import { PlaceCategory, TimeBucket, DayType } from '../../../domain/types/enums';
import { IRepository } from '../../../application/ports/IRepository';

export class PostgresWindowProposalRepository implements IRepository<WindowProposal> {
  constructor(private pool: Pool) {}

  async save(proposal: WindowProposal): Promise<WindowProposal> {
    // Normalización A < B
    const [uA, uB] = proposal.userA_id < proposal.userB_id ? [proposal.userA_id, proposal.userB_id] : [proposal.userB_id, proposal.userA_id];
    const [accA, accB] = proposal.userA_id < proposal.userB_id ? [proposal.acceptA, proposal.acceptB] : [proposal.acceptB, proposal.acceptA];

    const query = `
      INSERT INTO sync_windows (
        window_id, copresence_id, user_a_id, user_b_id, place_category, time_bucket, day_type,
        proposed_date, start_time, end_time, window_status, accept_a, accept_b,
        declined_by, created_at, expires_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      ON CONFLICT (window_id) DO UPDATE SET
        window_status = EXCLUDED.window_status,
        accept_a = EXCLUDED.accept_a,
        accept_b = EXCLUDED.accept_b,
        declined_by = EXCLUDED.declined_by,
        expires_at = EXCLUDED.expires_at
      RETURNING *;
    `;
    const values = [
      proposal.id,
      proposal.coPresenceId || null,
      uA,
      uB,
      proposal.place_category,
      proposal.time_bucket,
      proposal.day_type,
      proposal.proposed_date,
      proposal.start_time,
      proposal.end_time,
      proposal.status,
      accA,
      accB,
      proposal.declined_by || null,
      proposal.created_at,
      proposal.expires_at || null
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<WindowProposal | null> {
    const res = await this.pool.query('SELECT * FROM sync_windows WHERE window_id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findActiveByUser(userId: string): Promise<WindowProposal[]> {
    const res = await this.pool.query(
      'SELECT * FROM sync_windows WHERE (user_a_id = $1 OR user_b_id = $1) AND window_status = $2',
      [userId, 'pending']
    );
    return res.rows.map(row => this.mapToEntity(row));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM sync_windows WHERE user_a_id = $1 OR user_b_id = $1', [userId]);
  }

  private mapToEntity(row: any): WindowProposal {
    return {
      id: row.window_id,
      coPresenceId: row.copresence_id,
      userA_id: row.user_a_id,
      userB_id: row.user_b_id,
      place_category: row.place_category as PlaceCategory,
      time_bucket: row.time_bucket as TimeBucket,
      day_type: row.day_type as DayType,
      proposed_date: row.proposed_date.toISOString().split('T')[0],
      start_time: row.start_time.substring(0, 5),
      end_time: row.end_time.substring(0, 5),
      status: row.window_status as WindowProposalStatus,
      acceptA: row.accept_a,
      acceptB: row.accept_b,
      declined_by: row.declined_by,
      created_at: new Date(row.created_at),
      expires_at: row.expires_at ? new Date(row.expires_at) : undefined
    };
  }
}
