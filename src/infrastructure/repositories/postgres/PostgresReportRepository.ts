import { Pool } from 'pg';
import { Report, ReportReason } from '../../../domain/models/Report';
import { IRepository } from '../../../application/ports/IRepository';

export class PostgresReportRepository implements IRepository<Report> {
  constructor(private pool: Pool) {}

  async save(report: Report): Promise<Report> {
    const query = `
      INSERT INTO reports (id, reporter_user_id, reported_user_id, reason, created_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
    const values = [
      report.id,
      report.reporter_user_id,
      report.reported_user_id,
      report.reason,
      report.created_at
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<Report | null> {
    const res = await this.pool.query('SELECT * FROM reports WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM reports WHERE reporter_user_id = $1 OR reported_user_id = $1', [userId]);
  }

  private mapToEntity(row: any): Report {
    return {
      id: row.id,
      reporter_user_id: row.reporter_user_id,
      reported_user_id: row.reported_user_id,
      reason: row.reason as ReportReason,
      created_at: new Date(row.created_at)
    };
  }
}
