"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevelationRepository = void 0;
class RevelationRepository {
    constructor() {
        this.revelations = new Map();
    }
    async save(entity) {
        this.revelations.set(entity.id, entity);
        return entity;
    }
    async findById(id) {
        return this.revelations.get(id) || null;
    }
    async findByUserPairCanonical(userAId, userBId) {
        const [id1, id2] = [userAId, userBId].sort();
        for (const revelation of this.revelations.values()) {
            const [r1, r2] = [revelation.user_a_id, revelation.user_b_id].sort();
            if (r1 === id1 && r2 === id2) {
                return revelation;
            }
        }
        return null;
    }
    async findActiveByUser(userId) {
        return Array.from(this.revelations.values()).filter(r => (r.user_a_id === userId || r.user_b_id === userId) && r.status === 'active');
    }
    async purgeExpired(now) {
        const purgedIds = [];
        for (const revelation of this.revelations.values()) {
            if (revelation.status === 'active' && now >= revelation.expires_at) {
                revelation.status = 'expired';
                purgedIds.push(revelation.id);
            }
        }
        return purgedIds;
    }
    async deleteByUserId(userId) {
        for (const [id, revelation] of this.revelations.entries()) {
            if (revelation.user_a_id === userId || revelation.user_b_id === userId) {
                this.revelations.delete(id);
            }
        }
    }
}
exports.RevelationRepository = RevelationRepository;
//# sourceMappingURL=RevelationRepository.js.map