import { Pool } from 'pg';
import { ConsentState } from '../../../domain/models/ConsentState';
import { IRepository } from '../../../application/ports/IRepository';
import { ConsentStatus } from '../../../domain/types/enums';

export class PostgresConsentRepository implements IRepository<ConsentState> {
  constructor(private pool: Pool) {}

  async save(consent: ConsentState): Promise<ConsentState> {
    const query = `
      INSERT INTO consent_states (
        user_id, pattern_detection_consent, location_abstraction_acknowledgment,
        sync_window_proposals_consent, terms_accepted, privacy_policy_accepted, 
        consent_timestamp, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (user_id) DO UPDATE SET
        pattern_detection_consent = EXCLUDED.pattern_detection_consent,
        location_abstraction_acknowledgment = EXCLUDED.location_abstraction_acknowledgment,
        sync_window_proposals_consent = EXCLUDED.sync_window_proposals_consent,
        terms_accepted = EXCLUDED.terms_accepted,
        privacy_policy_accepted = EXCLUDED.privacy_policy_accepted,
        consent_timestamp = EXCLUDED.consent_timestamp,
        status = EXCLUDED.status
      RETURNING *;
    `;
    const values = [
      consent.user_id,
      consent.pattern_detection_consent,
      consent.location_abstraction_acknowledgment,
      consent.sync_window_proposals_consent,
      consent.terms_accepted,
      consent.privacy_policy_accepted,
      consent.consent_timestamp,
      consent.status
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<ConsentState | null> {
    const res = await this.pool.query('SELECT * FROM consent_states WHERE user_id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findByUserId(userId: string): Promise<ConsentState | null> {
    return this.findById(userId);
  }

  private mapToEntity(row: any): ConsentState {
    return {
      user_id: row.user_id,
      pattern_detection_consent: row.pattern_detection_consent,
      location_abstraction_acknowledgment: row.location_abstraction_acknowledgment,
      sync_window_proposals_consent: row.sync_window_proposals_consent,
      terms_accepted: row.terms_accepted,
      privacy_policy_accepted: row.privacy_policy_accepted,
      consent_timestamp: new Date(row.consent_timestamp),
      status: row.status as ConsentStatus
    };
  }
}
