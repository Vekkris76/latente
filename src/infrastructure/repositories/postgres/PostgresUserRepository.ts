import { Pool } from 'pg';
import { User } from '../../../domain/models/User';
import { IRepository } from '../../../application/ports/IRepository';
import { AccountStatus } from '../../../domain/types/enums';

export class PostgresUserRepository implements IRepository<User> {
  constructor(private pool: Pool) {}

  async save(user: User): Promise<User> {
    const query = `
      INSERT INTO users (user_id, name, age, profile_photo, observation_active, account_status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id) DO UPDATE SET
        name = EXCLUDED.name,
        age = EXCLUDED.age,
        profile_photo = EXCLUDED.profile_photo,
        observation_active = EXCLUDED.observation_active,
        account_status = EXCLUDED.account_status
      RETURNING *;
    `;
    const values = [
      user.user_id,
      user.name,
      user.age,
      user.profile_photo || null,
      user.observation_active,
      user.account_status,
      user.created_at
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const res = await this.pool.query('SELECT * FROM users WHERE user_id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM users WHERE user_id = $1', [userId]);
  }

  private mapToEntity(row: any): User {
    return {
      user_id: row.user_id,
      name: row.name,
      age: row.age,
      profile_photo: row.profile_photo,
      observation_active: row.observation_active,
      created_at: new Date(row.created_at),
      account_status: row.account_status as AccountStatus
    };
  }
}
