/**
 * Block entity según ITERACIÓN 7a
 */
export interface Block {
    id: string;
    blocker_user_id: string;
    blocked_user_id: string;
    created_at: Date;
}
export declare function validateBlockNotSelfBlock(block: Block): boolean;
//# sourceMappingURL=Block.d.ts.map