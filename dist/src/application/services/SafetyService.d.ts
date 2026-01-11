import { Block } from '../../domain/models/Block';
import { Report, ReportReason } from '../../domain/models/Report';
import { BlockRepository } from '../../infrastructure/persistence/memory/BlockRepository';
import { ReportRepository } from '../../infrastructure/persistence/memory/ReportRepository';
import { RevelationRepository } from '../../infrastructure/persistence/memory/RevelationRepository';
import { ConversationRepository } from '../../infrastructure/persistence/memory/ConversationRepository';
import { CoPresenceRepository } from '../../infrastructure/persistence/memory/CoPresenceRepository';
import { WindowProposalRepository } from '../../infrastructure/persistence/memory/WindowProposalRepository';
import { ProposalStateRepository } from '../../infrastructure/persistence/memory/ProposalStateRepository';
import { ActiveWindowRepository } from '../../infrastructure/persistence/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../infrastructure/persistence/memory/RecognitionRepository';
export declare class SafetyService {
    private blockRepo;
    private reportRepo;
    private revelationRepo;
    private conversationRepo;
    private coPresenceRepo;
    private proposalRepo;
    private proposalStateRepo;
    private activeWindowRepo;
    private recognitionRepo;
    constructor(blockRepo: BlockRepository, reportRepo: ReportRepository, revelationRepo: RevelationRepository, conversationRepo: ConversationRepository, coPresenceRepo: CoPresenceRepository, proposalRepo: WindowProposalRepository, proposalStateRepo: ProposalStateRepository, activeWindowRepo: ActiveWindowRepository, recognitionRepo: RecognitionRepository);
    blockUser(blockerId: string, blockedId: string, now: Date): Promise<Block>;
    reportUser(reporterId: string, reportedId: string, reason: ReportReason, now: Date): Promise<Report>;
}
//# sourceMappingURL=SafetyService.d.ts.map