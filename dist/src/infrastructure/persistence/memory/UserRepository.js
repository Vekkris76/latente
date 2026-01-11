"use strict";
/**
 * UserRepository - Implementación en memoria para Iteración 1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
class UserRepository {
    constructor() {
        this.users = new Map();
    }
    async save(user) {
        this.users.set(user.user_id, user);
        return user;
    }
    async findById(id) {
        return this.users.get(id) || null;
    }
    async deleteByUserId(userId) {
        this.users.delete(userId);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map