import { Block } from '../models/Block';
import { Report, ReportReason } from '../models/Report';
import { BlockRepository } from '../repositories/BlockRepository';
import { ReportRepository } from '../repositories/ReportRepository';
import { RevelationRepository } from '../repositories/RevelationRepository';
import { ConversationRepository } from '../repositories/ConversationRepository';
import { CoPresenceRepository } from '../repositories/CoPresenceRepository';
import { WindowProposalRepository } from '../repositories/WindowProposalRepository';
import { ProposalStateRepository } from '../repositories/ProposalStateRepository';
import { ActiveWindowRepository } from '../repositories/ActiveWindowRepository';
import { RecognitionRepository } from '../repositories/RecognitionRepository';
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