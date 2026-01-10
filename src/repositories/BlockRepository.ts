export class BlockRepository {
  private blocks: Set<string> = new Set();

  private getKey(userA: string, userB: string): string {
    const [min, max] = [userA, userB].sort();
    return `${min}:${max}`;
  }

  async saveBlock(userA: string, userB: string): Promise<void> {
    this.blocks.add(this.getKey(userA, userB));
  }

  async existsBlock(userA: string, userB: string): Promise<boolean> {
    return this.blocks.has(this.getKey(userA, userB));
  }

  async clear(): Promise<void> {
    this.blocks.clear();
  }
}
