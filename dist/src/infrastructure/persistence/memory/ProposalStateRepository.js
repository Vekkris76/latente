"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalStateRepository = void 0;
class ProposalStateRepository {
    constructor() {
        this.activeProposals = new Set();
    }
    async hasActiveProposal(userId) {
        return this.activeProposals.has(userId);
    }
    async setActiveProposal(userId, active) {
        if (active) {
            this.activeProposals.add(userId);
        }
        else {
            this.activeProposals.delete(userId);
        }
    }
    async deleteByUserId(userId) {
        this.activeProposals.delete(userId);
    }
    async clear() {
        this.activeProposals.clear();
    }
}
exports.ProposalStateRepository = ProposalStateRepository;
//# sourceMappingURL=ProposalStateRepository.js.map