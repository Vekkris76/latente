import { WindowProposal } from '../../domain/models/WindowProposal';
import { WindowProposalRepository } from '../../infrastructure/persistence/memory/WindowProposalRepository';
import { CooldownRepository } from '../../infrastructure/persistence/memory/CooldownRepository';
import { ProposalStateRepository } from '../../infrastructure/persistence/memory/ProposalStateRepository';
import { CoPresenceRepository } from '../../infrastructure/persistence/memory/CoPresenceRepository';
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