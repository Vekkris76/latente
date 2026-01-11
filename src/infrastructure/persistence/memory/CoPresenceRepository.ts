import { LatentCoPresence } from '../../../domain/models/LatentCoPresence';
import { LatentCoPresenceStatus } from '../../../domain/types/enums';
import { IRepository } from '../../../domain/repositories/IRepository';

export class CoPresenceRepository implements IRepository<LatentCoPresence> {
  private copresences: LatentCoPresence[] = [];

  async save(copresence: LatentCoPresence): Promise<LatentCoPresence> {
    const index = this.copresences.findIndex(cp => cp.copresence_id === copresence.copresence_id);
    if (index >= 0) {
      this.copresences[index] = copresence;
    } else {
      this.copresences.push(copresence);
    }
    return copresence;
  }

  async findById(id: string): Promise<LatentCoPresence | null> {
    return this.copresences.find(cp => cp.copresence_id === id) || null;
  }

  async findActiveByUser(userId: string): Promise<LatentCoPresence[]> {
    return this.copresences.filter(cp => 
      (cp.user_a_id === userId || cp.user_b_id === userId) && 
      cp.status === LatentCoPresenceStatus.DETECTED
    );
  }

  async existsActiveBetween(userA: string, userB: string, category: string, bucket: string): Promise<boolean> {
    return this.copresences.some(cp => 
      ((cp.user_a_id === userA && cp.user_b_id === userB) || (cp.user_a_id === userB && cp.user_b_id === userA)) &&
      cp.shared_place_category === category &&
      cp.shared_time_bucket === bucket &&
      cp.status === LatentCoPresenceStatus.DETECTED
    );
  }

  async findByPairAndPattern(userA: string, userB: string, category: string, bucket: string): Promise<LatentCoPresence | null> {
    return this.copresences.find(cp => 
      ((cp.user_a_id === userA && cp.user_b_id === userB) || (cp.user_a_id === userB && cp.user_b_id === userA)) &&
      cp.shared_place_category === category &&
      cp.shared_time_bucket === bucket
    ) || null;
  }

  async markInactive(id: string): Promise<void> {
    const cp = await this.findById(id);
    if (cp) {
      cp.status = LatentCoPresenceStatus.EXPIRED;
      await this.save(cp);
    }
  }

  async findAll(): Promise<LatentCoPresence[]> {
    return this.copresences;
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.copresences = this.copresences.filter(cp => cp.user_a_id !== userId && cp.user_b_id !== userId);
  }

  async clear(): Promise<void> {
    this.copresences = [];
  }
}
