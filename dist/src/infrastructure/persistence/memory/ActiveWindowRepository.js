"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveWindowRepository = void 0;
class ActiveWindowRepository {
    constructor() {
        this.windows = new Map();
    }
    async save(entity) {
        this.windows.set(entity.id, entity);
        return entity;
    }
    async findById(id) {
        return this.windows.get(id) || null;
    }
    async findActiveByUser(userId, now) {
        for (const window of this.windows.values()) {
            if ((window.user_a_id === userId || window.user_b_id === userId) &&
                window.status === 'active' &&
                now >= window.start_time &&
                now <= window.end_time) {
                return window;
            }
        }
        return null;
    }
    async delete(id) {
        this.windows.delete(id);
    }
    async deleteByUserId(userId) {
        for (const [id, window] of this.windows.entries()) {
            if (window.user_a_id === userId || window.user_b_id === userId) {
                this.windows.delete(id);
            }
        }
    }
    async findAll() {
        return Array.from(this.windows.values());
    }
}
exports.ActiveWindowRepository = ActiveWindowRepository;
//# sourceMappingURL=ActiveWindowRepository.js.map