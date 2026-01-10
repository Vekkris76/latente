import { WindowProposal } from '../models/WindowProposal';
import { WindowProposalRepository } from '../repositories/WindowProposalRepository';
import { CooldownRepository } from '../repositories/CooldownRepository';
import { ProposalStateRepository } from '../repositories/ProposalStateRepository';
import { CoPresenceRepository } from '../repositories/CoPresenceRepository';
export declare class WindowDecisionService {
    private proposalRepo;
    private cooldownRepo;
    private proposalStateRepo;
    private coPresenceRepo;
    constructor(proposalRepo: WindowProposalRepository, cooldownRepo: CooldownRepository, proposalStateRepo: ProposalStateRepository, coPresenceRepo: CoPresenceRepository);
    accept(proposalId: string, userId: string, now: Date): Promise<WindowProposal>;
    decline(proposalId: string, userId: string, now: Date): Promise<WindowProposal>;
    expireProposals(now: Date): Promise<number>;
    private purgeRelatedCoPresence;
}
//# sourceMappingURL=WindowDecisionService.d.ts.map