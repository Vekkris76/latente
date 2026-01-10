"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRepository = void 0;
class ConversationRepository {
    constructor() {
        this.messages = new Map();
    }
    async save(entity) {
        this.messages.set(entity.id, entity);
        return entity;
    }
    async findById(id) {
        return this.messages.get(id) || null;
    }
    async findByRevelationId(revelationId) {
        return Array.from(this.messages.values())
            .filter(m => m.revelation_id === revelationId)
            .sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
    }
    async deleteByRevelationId(revelationId) {
        for (const [id, message] of this.messages.entries()) {
            if (message.revelation_id === revelationId) {
                this.messages.delete(id);
            }
        }
    }
    async deleteByUserId(userId) {
        for (const [id, message] of this.messages.entries()) {
            if (message.sender_user_id === userId) {
                this.messages.delete(id);
            }
        }
    }
}
exports.ConversationRepository = ConversationRepository;
//# sourceMappingURL=ConversationRepository.js.map