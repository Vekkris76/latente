import { ActiveWindow } from '../../../domain/models/ActiveWindow';
import { IRepository } from '../../../application/ports/IRepository';

export class ActiveWindowRepository implements IRepository<ActiveWindow> {
  private windows: Map<string, ActiveWindow> = new Map();

  async save(entity: ActiveWindow): Promise<ActiveWindow> {
    this.windows.set(entity.id, entity);
    return entity;
  }

  async findById(id: string): Promise<ActiveWindow | null> {
    return this.windows.get(id) || null;
  }

  async findActiveByUser(userId: string, now: Date): Promise<ActiveWindow | null> {
    for (const window of this.windows.values()) {
      if (
        (window.user_a_id === userId || window.user_b_id === userId) &&
        window.status === 'active' &&
        now >= window.start_time &&
        now <= window.end_time
      ) {
        return window;
      }
    }
    return null;
  }

  async delete(id: string): Promise<void> {
    this.windows.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    for (const [id, window] of this.windows.entries()) {
      if (window.user_a_id === userId || window.user_b_id === userId) {
        this.windows.delete(id);
      }
    }
  }

  async findAll(): Promise<ActiveWindow[]> {
    return Array.from(this.windows.values());
  }
}
