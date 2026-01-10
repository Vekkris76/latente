import { WindowProposal } from '../models/WindowProposal';
import { WindowProposalRepository } from '../repositories/WindowProposalRepository';
import { CooldownRepository } from '../repositories/CooldownRepository';
import { ProposalStateRepository } from '../repositories/ProposalStateRepository';
import { CoPresenceRepository } from '../repositories/CoPresenceRepository';
import { PatternRepository } from '../repositories/PatternRepository';
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