import { ConversationMessage } from '../../../domain/models/ConversationMessage';
import { IRepository } from '../../../application/ports/IRepository';

export class ConversationRepository implements IRepository<ConversationMessage> {
  private messages: Map<string, ConversationMessage> = new Map();

  async save(entity: ConversationMessage): Promise<ConversationMessage> {
    this.messages.set(entity.id, entity);
    return entity;
  }

  async findById(id: string): Promise<ConversationMessage | null> {
    return this.messages.get(id) || null;
  }

  async findByRevelationId(revelationId: string): Promise<ConversationMessage[]> {
    return Array.from(this.messages.values())
      .filter(m => m.revelation_id === revelationId)
      .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
  }

  async deleteByRevelationId(revelationId: string): Promise<void> {
    for (const [id, message] of this.messages.entries()) {
      if (message.revelation_id === revelationId) {
        this.messages.delete(id);
      }
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    for (const [id, message] of this.messages.entries()) {
      if (message.sender_user_id === userId) {
        this.messages.delete(id);
      }
    }
  }
}
