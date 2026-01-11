import { WindowProposal } from '../../../domain/models/WindowProposal';
import { IRepository } from '../../../domain/repositories/IRepository';

export class WindowProposalRepository implements IRepository<WindowProposal> {
  private proposals: Map<string, WindowProposal> = new Map();

  async save(proposal: WindowProposal): Promise<WindowProposal> {
    this.proposals.set(proposal.id, proposal);
    return proposal;
  }

  async findById(id: string): Promise<WindowProposal | null> {
    return this.proposals.get(id) || null;
  }

  async findActiveByUser(userId: string): Promise<WindowProposal | null> {
    return Array.from(this.proposals.values()).find(p => 
      (p.userA_id === userId || p.userB_id === userId) && 
      (p.status === 'pending' || p.status === 'accepted_by_a' || p.status === 'accepted_by_b')
    ) || null;
  }

  async findActiveBetweenPair(userAId: string, userBId: string): Promise<WindowProposal | null> {
    const [id1, id2] = [userAId, userBId].sort();
    return Array.from(this.proposals.values()).find(p => 
      p.userA_id === id1 && p.userB_id === id2 && 
      (p.status === 'pending' || p.status === 'accepted_by_a' || p.status === 'accepted_by_b')
    ) || null;
  }

  async findPendingExpirable(now: Date): Promise<WindowProposal[]> {
    return Array.from(this.proposals.values()).filter(p => 
      (p.status === 'pending' || p.status === 'accepted_by_a' || p.status === 'accepted_by_b') &&
      p.expires_at && p.expires_at <= now
    );
  }

  async existsActiveBetweenPair(userAId: string, userBId: string): Promise<boolean> {
    const proposal = await this.findActiveBetweenPair(userAId, userBId);
    return proposal !== null;
  }

  async listByUser(userId: string): Promise<WindowProposal[]> {
    return Array.from(this.proposals.values()).filter(p => 
      p.userA_id === userId || p.userB_id === userId
    );
  }

  async findAll(): Promise<WindowProposal[]> {
    return Array.from(this.proposals.values());
  }

  async delete(id: string): Promise<void> {
    this.proposals.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    for (const [id, prop] of this.proposals.entries()) {
      if (prop.userA_id === userId || prop.userB_id === userId) {
        this.proposals.delete(id);
      }
    }
  }
}
