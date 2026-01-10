"use strict";
/**
 * ConsentRepository - Implementación en memoria para Iteración 1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentRepository = void 0;
class ConsentRepository {
    constructor() {
        this.consents = new Map();
    }
    async save(consent) {
        this.consents.set(consent.user_id, consent);
        return consent;
    }
    async findById(id) {
        return this.consents.get(id) || null;
    }
    async findByUserId(userId) {
        return this.consents.get(userId) || null;
    }
}
exports.ConsentRepository = ConsentRepository;
//# sourceMappingURL=ConsentRepository.js.map