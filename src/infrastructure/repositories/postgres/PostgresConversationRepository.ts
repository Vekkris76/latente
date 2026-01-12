import { Pool } from 'pg';
import { ConversationMessage } from '../../../domain/models/ConversationMessage';
import { IRepository } from '../../../application/ports/IRepository';

export class PostgresConversationRepository implements IRepository<ConversationMessage> {
  constructor(private pool: Pool) {}

  async save(message: ConversationMessage): Promise<ConversationMessage> {
    const query = `
      INSERT INTO conversation_messages (id, revelation_id, sender_id, content, sent_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) DO NOTHING
      RETURNING *;
    `;
    const values = [
      message.id,
      message.revelation_id,
      message.sender_user_id,
      message.text,
      message.created_at
    ];

    const res = await this.pool.query(query, values);
    return this.mapToEntity(res.rows[0]);
  }

  async findById(id: string): Promise<ConversationMessage | null> {
    const res = await this.pool.query('SELECT * FROM conversation_messages WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    return this.mapToEntity(res.rows[0]);
  }

  async findByRevelation(revelationId: string): Promise<ConversationMessage[]> {
    const res = await this.pool.query(
      'SELECT * FROM conversation_messages WHERE revelation_id = $1 ORDER BY sent_at ASC',
      [revelationId]
    );
    return res.rows.map(row => this.mapToEntity(row));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.pool.query('DELETE FROM conversation_messages WHERE sender_id = $1', [userId]);
  }

  private mapToEntity(row: any): ConversationMessage {
    return {
      id: row.id,
      revelation_id: row.revelation_id,
      sender_user_id: row.sender_id,
      text: row.content,
      created_at: new Date(row.sent_at)
    };
  }
}
