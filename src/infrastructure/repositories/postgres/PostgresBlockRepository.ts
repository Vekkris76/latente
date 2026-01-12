import { Pool } from 'pg';
import { Block } from '../../../domain/models/Block';
import { IRepository } from '../../../application/ports/IRepository';

export class PostgresBlockRepository implements IRepository<Block> {
  constructor(private pool: Pool) {}

  async save(block: Block): Promise<Block> {
    const query = `
      INSERT INTO blocks (id, blocker_user_id, blocked_user_id, created_at)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
    const values = [
      block.id,
      block.blocker_user_id,
      block.blocked_user_id,
      block.created_at
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<Block | null> {
    const res = await this.pool.query('SELECT * FROM blocks WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async exists(blockerId: string, blockedId: string): Promise<boolean> {
    const res = await this.pool.query(
      'SELECT 1 FROM blocks WHERE blocker_user_id = $1 AND blocked_user_id = $2',
      [blockerId, blockedId]
    );
    return res.rows.length > 0;
  }

  async deleteByUserId(userId: string): Promise<void> {
    // Según reglas v1, los bloques se conservan incluso si se borra la cuenta,
    // pero el port IRepository requiere deleteByUserId para limpieza de tests.
    await this.pool.query('DELETE FROM blocks WHERE blocker_user_id = $1 OR blocked_user_id = $1', [userId]);
  }

  private mapToEntity(row: any): Block {
    return {
      id: row.id,
      blocker_user_id: row.blocker_user_id,
      blocked_user_id: row.blocked_user_id,
      created_at: new Date(row.created_at)
    };
  }
}
