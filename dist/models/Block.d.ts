/**
 * Block entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */
import { BlockStatus } from '../types/enums';
export interface Block {
    block_id: string;
    blocker_user_id: string;
    blocked_user_id: string;
    blocked_at: Date;
    reason?: string;
    revelation_id?: string;
    status: BlockStatus;
}
export declare function validateBlockNotSelfBlock(block: Block): boolean;
//# sourceMappingURL=Block.d.ts.map