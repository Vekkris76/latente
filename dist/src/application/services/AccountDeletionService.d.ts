import { EventRepository } from '../../infrastructure/persistence/memory/EventRepository';
import { PatternRepository } from '../../infrastructure/persistence/memory/PatternRepository';
import { CoPresenceRepository } from '../../infrastructure/persistence/memory/CoPresenceRepository';
import { WindowProposalRepository } from '../../infrastructure/persistence/memory/WindowProposalRepository';
import { ActiveWindowRepository } from '../../infrastructure/persistence/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../infrastructure/persistence/memory/RecognitionRepository';
import { RevelationRepository } from '../../infrastructure/persistence/memory/RevelationRepository';
import { ConversationRepository } from '../../infrastructure/persistence/memory/ConversationRepository';
import { CooldownRepository } from '../../infrastructure/persistence/memory/CooldownRepository';
import { ProposalStateRepository } from '../../infrastructure/persistence/memory/ProposalStateRepository';
import { UserRepository } from '../../infrastructure/persistence/memory/UserRepository';
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