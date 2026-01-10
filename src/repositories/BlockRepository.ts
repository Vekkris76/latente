import { Block } from '../models/Block';

export class BlockRepository {
  private blocks: Map<string, Block> = new Map();

  async save(block: Block): Promise<Block> {
    this.blocks.set(block.id, block);
    return block;
  }

  async existsBetween(userA: string, userB: string): Promise<boolean> {
    for (const block of this.blocks.values()) {
      if (
        (block.blocker_user_id === userA && block.blocked_user_id === userB) ||
        (block.blocker_user_id === userB && block.blocked_user_id === userA)
      ) {
        return true;
      }
    }
    return false;
  }

  async existsBlock(blocker: string, blocked: string): Promise<boolean> {
    for (const block of this.blocks.values()) {
      if (block.blocker_user_id === blocker && block.blocked_user_id === blocked) {
        return true;
      }
    }
    return false;
  }

  async listByUser(userId: string): Promise<Block[]> {
    return Array.from(this.blocks.values()).filter(
      b => b.blocker_user_id === userId || b.blocked_user_id === userId
    );
  }

  async clear(): Promise<void> {
    this.blocks.clear();
  }
}
