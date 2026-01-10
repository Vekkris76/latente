"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CooldownRepository = void 0;
class CooldownRepository {
    constructor() {
        this.cooldowns = new Map();
    }
    async setCooldownUntil(userId, date) {
        const cooldownDate = typeof date === 'string' ? new Date(date) : date;
        this.cooldowns.set(userId, cooldownDate);
    }
    async isInCooldown(userId, now) {
        const cooldownUntil = this.cooldowns.get(userId);
        if (!cooldownUntil)
            return false;
        return now < cooldownUntil;
    }
    async getCooldownUntil(userId) {
        return this.cooldowns.get(userId) || null;
    }
    async deleteByUserId(userId) {
        this.cooldowns.delete(userId);
    }
}
exports.CooldownRepository = CooldownRepository;
//# sourceMappingURL=CooldownRepository.js.map