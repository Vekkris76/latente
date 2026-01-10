"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowDecisionService = void 0;
const decisions_1 = require("../config/decisions");
const dateUtils_1 = require("../utils/dateUtils");
class WindowDecisionService {
    constructor(proposalRepo, cooldownRepo, proposalStateRepo, coPresenceRepo) {
        this.proposalRepo = proposalRepo;
        this.cooldownRepo = cooldownRepo;
        this.proposalStateRepo = proposalStateRepo;
        this.coPresenceRepo = coPresenceRepo;
    }
    async accept(proposalId, userId, now) {
        const proposal = await this.proposalRepo.findById(proposalId);
        if (!proposal)
            throw new Error('Proposal not found');
        const validStatuses = ['pending', 'accepted_by_a', 'accepted_by_b'];
        if (!validStatuses.includes(proposal.status)) {
            throw new Error(`Proposal is in status ${proposal.status} and cannot be accepted`);
        }
        if (proposal.expires_at && now > proposal.expires_at) {
            // Técnicamente debería haber sido expirada por el cron, pero validamos aquí también
            throw new Error('Proposal has expired');
        }
        if (userId === proposal.userA_id) {
            proposal.acceptA = true;
        }
        else if (userId === proposal.userB_id) {
            proposal.acceptB = true;
        }
        else {
            throw new Error('User is not part of this proposal');
        }
        if (proposal.acceptA && proposal.acceptB) {
            proposal.status = 'activated';
            // Al activar, liberar ProposalStateRepository para ambos usuarios
            await this.proposalStateRepo.setActiveProposal(proposal.userA_id, false);
            await this.proposalStateRepo.setActiveProposal(proposal.userB_id, false);
        }
        else if (proposal.acceptA) {
            proposal.status = 'accepted_by_a';
        }
        else if (proposal.acceptB) {
            proposal.status = 'accepted_by_b';
        }
        await this.proposalRepo.save(proposal);
        return proposal;
    }
    async decline(proposalId, userId, now) {
        const proposal = await this.proposalRepo.findById(proposalId);
        if (!proposal)
            throw new Error('Proposal not found');
        if (proposal.status === 'declined' || proposal.status === 'expired' || proposal.status === 'activated') {
            throw new Error(`Proposal is already in a final state: ${proposal.status}`);
        }
        proposal.status = 'declined';
        proposal.declined_by = userId;
        // Aplicar cooldown 7 días al declinante
        const cooldownUntil = (0, dateUtils_1.addDays)(now, decisions_1.DECLINE_COOLDOWN_DAYS);
        await this.cooldownRepo.setCooldownUntil(userId, cooldownUntil);
        // Purgar copresencia latente relacionada
        await this.purgeRelatedCoPresence(proposal);
        // Liberar ProposalStateRepository para ambos usuarios
        await this.proposalStateRepo.setActiveProposal(proposal.userA_id, false);
        await this.proposalStateRepo.setActiveProposal(proposal.userB_id, false);
        await this.proposalRepo.save(proposal);
        return proposal;
    }
    async expireProposals(now) {
        const expirable = await this.proposalRepo.findPendingExpirable(now);
        let count = 0;
        for (const proposal of expirable) {
            proposal.status = 'expired';
            // Purgar copresencia latente
            await this.purgeRelatedCoPresence(proposal);
            // Liberar ProposalStateRepository
            await this.proposalStateRepo.setActiveProposal(proposal.userA_id, false);
            await this.proposalStateRepo.setActiveProposal(proposal.userB_id, false);
            await this.proposalRepo.save(proposal);
            count++;
        }
        return count;
    }
    async purgeRelatedCoPresence(proposal) {
        if (proposal.coPresenceId) {
            await this.coPresenceRepo.markInactive(proposal.coPresenceId);
        }
        else {
            // Localizar por pareja canónica + (place_category, time_bucket)
            const cp = await this.coPresenceRepo.findByPairAndPattern(proposal.userA_id, proposal.userB_id, proposal.place_category, proposal.time_bucket);
            if (cp) {
                await this.coPresenceRepo.markInactive(cp.copresence_id);
            }
        }
    }
}
exports.WindowDecisionService = WindowDecisionService;
//# sourceMappingURL=WindowDecisionService.js.map