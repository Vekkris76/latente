import { Revelation } from '../models/Revelation';
import { IRepository } from './IRepository';

export class RevelationRepository implements IRepository<Revelation> {
  private revelations: Map<string, Revelation> = new Map();

  async save(entity: Revelation): Promise<Revelation> {
    this.revelations.set(entity.id, entity);
    return entity;
  }

  async findById(id: string): Promise<Revelation | null> {
    return this.revelations.get(id) || null;
  }

  async findByUserPairCanonical(userAId: string, userBId: string): Promise<Revelation | null> {
    const [id1, id2] = [userAId, userBId].sort();
    for (const revelation of this.revelations.values()) {
      const [r1, r2] = [revelation.user_a_id, revelation.user_b_id].sort();
      if (r1 === id1 && r2 === id2 && revelation.status === 'active') {
        return revelation;
      }
    }
    return null;
  }

  async findActiveByUser(userId: string): Promise<Revelation[]> {
    return Array.from(this.revelations.values()).filter(
      r => (r.user_a_id === userId || r.user_b_id === userId) && r.status === 'active'
    );
  }

  async purgeExpired(now: Date): Promise<string[]> {
    const purgedIds: string[] = [];
    for (const revelation of this.revelations.values()) {
      if (revelation.status === 'active' && now >= revelation.expires_at) {
        revelation.status = 'expired';
        purgedIds.push(revelation.id);
      }
    }
    return purgedIds;
  }
}
