import { Recognition } from '../models/Recognition';
import { IRepository } from './IRepository';

export class RecognitionRepository implements IRepository<Recognition> {
  private recognitions: Map<string, Recognition> = new Map();

  async save(entity: Recognition): Promise<Recognition> {
    this.recognitions.set(entity.id, entity);
    return entity;
  }

  async findById(id: string): Promise<Recognition | null> {
    return this.recognitions.get(id) || null;
  }

  async findByWindowAndUser(windowId: string, userId: string): Promise<Recognition | null> {
    for (const recognition of this.recognitions.values()) {
      if (recognition.active_window_id === windowId && recognition.user_id === userId) {
        return recognition;
      }
    }
    return null;
  }

  async findByWindow(windowId: string): Promise<Recognition[]> {
    return Array.from(this.recognitions.values()).filter(r => r.active_window_id === windowId);
  }

  async deleteByWindowId(windowId: string): Promise<void> {
    for (const [id, recognition] of this.recognitions.entries()) {
      if (recognition.active_window_id === windowId) {
        this.recognitions.delete(id);
      }
    }
  }

  async purgeExpired(now: Date): Promise<number> {
    let count = 0;
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    for (const [id, recognition] of this.recognitions.entries()) {
      if (recognition.created_at < twentyFourHoursAgo) {
        this.recognitions.delete(id);
        count++;
      }
    }
    return count;
  }
}
