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

export class AccountDeletionService {
  constructor(
    private eventRepo: EventRepository,
    private patternRepo: PatternRepository,
    private coPresenceRepo: CoPresenceRepository,
    private proposalRepo: WindowProposalRepository,
    private activeWindowRepo: ActiveWindowRepository,
    private recognitionRepo: RecognitionRepository,
    private revelationRepo: RevelationRepository,
    private conversationRepo: ConversationRepository,
    private cooldownRepo: CooldownRepository,
    private proposalStateRepo: ProposalStateRepository,
    private userRepo: UserRepository
  ) {}

  async deleteAccount(userId: string, now: Date): Promise<void> {
    // 1. Borrar datos directos del usuario
    await this.eventRepo.deleteByUserId(userId);
    await this.patternRepo.deleteByUserId(userId);
    await this.cooldownRepo.deleteByUserId(userId);
    await this.proposalStateRepo.deleteByUserId(userId);
    await this.userRepo.deleteByUserId(userId);

    // 2. Borrar datos compartidos/vinculados
    // CoPresences, Proposals, ActiveWindows, Recognitions, Revelations, Conversations
    // Estos repos ya tienen deleteByUserId que filtra si el usuario es A o B
    await this.coPresenceRepo.deleteByUserId(userId);
    await this.proposalRepo.deleteByUserId(userId);
    await this.activeWindowRepo.deleteByUserId(userId);
    await this.recognitionRepo.deleteByUserId(userId);
    await this.revelationRepo.deleteByUserId(userId);
    await this.conversationRepo.deleteByUserId(userId);

    // Nota: BlockRepository y ReportRepository se conservan según reglas (v1)
  }
}
