export class ProposalStateRepository {
  private activeProposals: Set<string> = new Set();

  async hasActiveProposal(userId: string): Promise<boolean> {
    return this.activeProposals.has(userId);
  }

  async setActiveProposal(userId: string, active: boolean): Promise<void> {
    if (active) {
      this.activeProposals.add(userId);
    } else {
      this.activeProposals.delete(userId);
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.activeProposals.delete(userId);
  }

  async clear(): Promise<void> {
    this.activeProposals.clear();
  }
}
