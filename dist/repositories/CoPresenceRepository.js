"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoPresenceRepository = void 0;
const enums_1 = require("../types/enums");
class CoPresenceRepository {
    constructor() {
        this.copresences = [];
    }
    async save(copresence) {
        const index = this.copresences.findIndex(cp => cp.copresence_id === copresence.copresence_id);
        if (index >= 0) {
            this.copresences[index] = copresence;
        }
        else {
            this.copresences.push(copresence);
        }
        return copresence;
    }
    async findById(id) {
        return this.copresences.find(cp => cp.copresence_id === id) || null;
    }
    async findActiveByUser(userId) {
        return this.copresences.filter(cp => (cp.user_a_id === userId || cp.user_b_id === userId) &&
            cp.status === enums_1.LatentCoPresenceStatus.DETECTED);
    }
    async existsActiveBetween(userA, userB, category, bucket) {
        return this.copresences.some(cp => ((cp.user_a_id === userA && cp.user_b_id === userB) || (cp.user_a_id === userB && cp.user_b_id === userA)) &&
            cp.shared_place_category === category &&
            cp.shared_time_bucket === bucket &&
            cp.status === enums_1.LatentCoPresenceStatus.DETECTED);
    }
    async findByPairAndPattern(userA, userB, category, bucket) {
        return this.copresences.find(cp => ((cp.user_a_id === userA && cp.user_b_id === userB) || (cp.user_a_id === userB && cp.user_b_id === userA)) &&
            cp.shared_place_category === category &&
            cp.shared_time_bucket === bucket) || null;
    }
    async markInactive(id) {
        const cp = await this.findById(id);
        if (cp) {
            cp.status = enums_1.LatentCoPresenceStatus.EXPIRED;
            await this.save(cp);
        }
    }
    async findAll() {
        return this.copresences;
    }
    async deleteByUserId(userId) {
        this.copresences = this.copresences.filter(cp => cp.user_a_id !== userId && cp.user_b_id !== userId);
    }
    async clear() {
        this.copresences = [];
    }
}
exports.CoPresenceRepository = CoPresenceRepository;
//# sourceMappingURL=CoPresenceRepository.js.map