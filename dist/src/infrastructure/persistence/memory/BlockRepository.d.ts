import { Block } from '../../../domain/models/Block';
export declare class BlockRepository {
    private blocks;
    save(block: Block): Promise<Block>;
    existsBetween(userA: string, userB: string): Promise<boolean>;
    existsBlock(blocker: string, blocked: string): Promise<boolean>;
    listByUser(userId: string): Promise<Block[]>;
    clear(): Promise<void>;
}
//# sourceMappingURL=BlockRepository.d.ts.map