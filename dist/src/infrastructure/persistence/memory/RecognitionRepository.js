"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecognitionRepository = void 0;
class RecognitionRepository {
    constructor() {
        this.recognitions = new Map();
    }
    async save(entity) {
        this.recognitions.set(entity.id, entity);
        return entity;
    }
    async findById(id) {
        return this.recognitions.get(id) || null;
    }
    async findByWindowAndUser(windowId, userId) {
        for (const recognition of this.recognitions.values()) {
            if (recognition.active_window_id === windowId && recognition.user_id === userId) {
                return recognition;
            }
        }
        return null;
    }
    async findByWindow(windowId) {
        return Array.from(this.recognitions.values()).filter(r => r.active_window_id === windowId);
    }
    async deleteByWindowId(windowId) {
        for (const [id, recognition] of this.recognitions.entries()) {
            if (recognition.active_window_id === windowId) {
                this.recognitions.delete(id);
            }
        }
    }
    async deleteByUserId(userId) {
        for (const [id, recognition] of this.recognitions.entries()) {
            if (recognition.user_id === userId) {
                this.recognitions.delete(id);
            }
        }
    }
    async purgeExpired(now) {
        let count = 0;
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        for (const [id, recognition] of this.recognitions.entries()) {
            if (recognition.created_at < twentyFourHoursAgo) {
                this.recognitions.delete(id);
                count++;
            }
        }
        return count;
    }
}
exports.RecognitionRepository = RecognitionRepository;
//# sourceMappingURL=RecognitionRepository.js.map