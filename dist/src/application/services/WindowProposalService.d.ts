import { WindowProposal } from '../../domain/models/WindowProposal';
import { WindowProposalRepository } from '../../infrastructure/persistence/memory/WindowProposalRepository';
import { CooldownRepository } from '../../infrastructure/persistence/memory/CooldownRepository';
import { ProposalStateRepository } from '../../infrastructure/persistence/memory/ProposalStateRepository';
import { CoPresenceRepository } from '../../infrastructure/persistence/memory/CoPresenceRepository';
import { PatternRepository } from '../../infrastructure/persistence/memory/PatternRepository';
export interface WindowProposalConfig {
    durationMinutes: number | null;
}
export declare class WindowProposalService {
    private proposalRepo;
    private cooldownRepo;
    private proposalStateRepo;
    private coPresenceRepo;
    private patternRepo;
    private config;
    constructor(proposalRepo: WindowProposalRepository, cooldownRepo: CooldownRepository, proposalStateRepo: ProposalStateRepository, coPresenceRepo: CoPresenceRepository, patternRepo: PatternRepository, config?: WindowProposalConfig);
    generateFromCoPresences(now: Date): Promise<WindowProposal[]>;
    private createProposal;
}
//# sourceMappingURL=WindowProposalService.d.ts.map