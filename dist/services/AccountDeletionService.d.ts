import { EventRepository } from '../repositories/EventRepository';
import { PatternRepository } from '../repositories/PatternRepository';
import { CoPresenceRepository } from '../repositories/CoPresenceRepository';
import { WindowProposalRepository } from '../repositories/WindowProposalRepository';
import { ActiveWindowRepository } from '../repositories/ActiveWindowRepository';
import { RecognitionRepository } from '../repositories/RecognitionRepository';
import { RevelationRepository } from '../repositories/RevelationRepository';
import { ConversationRepository } from '../repositories/ConversationRepository';
import { CooldownRepository } from '../repositories/CooldownRepository';
import { ProposalStateRepository } from '../repositories/ProposalStateRepository';
import { UserRepository } from '../repositories/UserRepository';
export declare class AccountDeletionService {
    private eventRepo;
    private patternRepo;
    private coPresenceRepo;
    private proposalRepo;
    private activeWindowRepo;
    private recognitionRepo;
    private revelationRepo;
    private conversationRepo;
    private cooldownRepo;
    private proposalStateRepo;
    private userRepo;
    constructor(eventRepo: EventRepository, patternRepo: PatternRepository, coPresenceRepo: CoPresenceRepository, proposalRepo: WindowProposalRepository, activeWindowRepo: ActiveWindowRepository, recognitionRepo: RecognitionRepository, revelationRepo: RevelationRepository, conversationRepo: ConversationRepository, cooldownRepo: CooldownRepository, proposalStateRepo: ProposalStateRepository, userRepo: UserRepository);
    deleteAccount(userId: string, now: Date): Promise<void>;
}
//# sourceMappingURL=AccountDeletionService.d.ts.map