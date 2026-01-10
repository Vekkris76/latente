"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockRepository = void 0;
class BlockRepository {
    constructor() {
        this.blocks = new Map();
    }
    async save(block) {
        this.blocks.set(block.id, block);
        return block;
    }
    async existsBetween(userA, userB) {
        for (const block of this.blocks.values()) {
            if ((block.blocker_user_id === userA && block.blocked_user_id === userB) ||
                (block.blocker_user_id === userB && block.blocked_user_id === userA)) {
                return true;
            }
        }
        return false;
    }
    async existsBlock(blocker, blocked) {
        for (const block of this.blocks.values()) {
            if (block.blocker_user_id === blocker && block.blocked_user_id === blocked) {
                return true;
            }
        }
        return false;
    }
    async listByUser(userId) {
        return Array.from(this.blocks.values()).filter(b => b.blocker_user_id === userId || b.blocked_user_id === userId);
    }
    async clear() {
        this.blocks.clear();
    }
}
exports.BlockRepository = BlockRepository;
//# sourceMappingURL=BlockRepository.js.map