"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowProposalRepository = void 0;
class WindowProposalRepository {
    constructor() {
        this.proposals = new Map();
    }
    async save(proposal) {
        this.proposals.set(proposal.id, proposal);
        return proposal;
    }
    async findById(id) {
        return this.proposals.get(id) || null;
    }
    async findActiveByUser(userId) {
        return Array.from(this.proposals.values()).find(p => (p.userA_id === userId || p.userB_id === userId) &&
            (p.status === 'pending' || p.status === 'accepted_by_a' || p.status === 'accepted_by_b')) || null;
    }
    async findActiveBetweenPair(userAId, userBId) {
        const [id1, id2] = [userAId, userBId].sort();
        return Array.from(this.proposals.values()).find(p => p.userA_id === id1 && p.userB_id === id2 &&
            (p.status === 'pending' || p.status === 'accepted_by_a' || p.status === 'accepted_by_b')) || null;
    }
    async findPendingExpirable(now) {
        return Array.from(this.proposals.values()).filter(p => (p.status === 'pending' || p.status === 'accepted_by_a' || p.status === 'accepted_by_b') &&
            p.expires_at && p.expires_at <= now);
    }
    async existsActiveBetweenPair(userAId, userBId) {
        const proposal = await this.findActiveBetweenPair(userAId, userBId);
        return proposal !== null;
    }
    async listByUser(userId) {
        return Array.from(this.proposals.values()).filter(p => p.userA_id === userId || p.userB_id === userId);
    }
    async findAll() {
        return Array.from(this.proposals.values());
    }
    async delete(id) {
        this.proposals.delete(id);
    }
    async deleteByUserId(userId) {
        for (const [id, prop] of this.proposals.entries()) {
            if (prop.userA_id === userId || prop.userB_id === userId) {
                this.proposals.delete(id);
            }
        }
    }
}
exports.WindowProposalRepository = WindowProposalRepository;
//# sourceMappingURL=WindowProposalRepository.js.map