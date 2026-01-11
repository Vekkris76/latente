"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternRepository = void 0;
class PatternRepository {
    constructor() {
        this.patterns = [];
    }
    async save(pattern) {
        const index = this.patterns.findIndex(p => p.pattern_id === pattern.pattern_id);
        if (index >= 0) {
            this.patterns[index] = pattern;
        }
        else {
            this.patterns.push(pattern);
        }
        return pattern;
    }
    async findById(id) {
        return this.patterns.find(p => p.pattern_id === id) || null;
    }
    async findAllByUser(userId) {
        return this.patterns.filter(p => p.user_id === userId);
    }
    async deleteByUserId(userId) {
        this.patterns = this.patterns.filter(p => p.user_id !== userId);
    }
    async upsertByKey(pattern) {
        const index = this.patterns.findIndex(p => p.user_id === pattern.user_id &&
            p.place_category === pattern.place_category &&
            p.time_bucket === pattern.time_bucket &&
            p.day_type === pattern.day_type);
        if (index >= 0) {
            this.patterns[index] = pattern;
        }
        else {
            this.patterns.push(pattern);
        }
        return pattern;
    }
    // Para tests
    async clear() {
        this.patterns = [];
    }
}
exports.PatternRepository = PatternRepository;
//# sourceMappingURL=PatternRepository.js.map