import { EventIngestionService } from '../../../src/services/events/EventIngestionService';
import { PatternDetectionService } from '../../../src/services/events/PatternDetectionService';
import { CoPresenceDetectionService } from '../../../src/services/events/CoPresenceDetectionService';
import { WindowProposalService } from '../../../src/services/WindowProposalService';
import { WindowDecisionService } from '../../../src/services/WindowDecisionService';
import { ActiveWindowService } from '../../../src/services/ActiveWindowService';
import { RecognitionService } from '../../../src/services/RecognitionService';
import { RevelationService } from '../../../src/services/RevelationService';
import { AccountDeletionService } from '../../../src/services/AccountDeletionService';

import { EventRepository } from '../../../src/repositories/EventRepository';
import { PatternRepository } from '../../../src/repositories/PatternRepository';
import { CoPresenceRepository } from '../../../src/repositories/CoPresenceRepository';
import { WindowProposalRepository } from '../../../src/repositories/WindowProposalRepository';
import { CooldownRepository } from '../../../src/repositories/CooldownRepository';
import { ProposalStateRepository } from '../../../src/repositories/ProposalStateRepository';
import { UserRepository } from '../../../src/repositories/UserRepository';
import { BlockRepository } from '../../../src/repositories/BlockRepository';
import { ReportRepository } from '../../../src/repositories/ReportRepository';
import { ActiveWindowRepository } from '../../../src/repositories/ActiveWindowRepository';
import { RecognitionRepository } from '../../../src/repositories/RecognitionRepository';
import { RevelationRepository } from '../../../src/repositories/RevelationRepository';
import { ConversationRepository } from '../../../src/repositories/ConversationRepository';

import { AbstractEventValidator } from '../../../src/validation/AbstractEventValidator';
import { PlaceCategory, TimeBucket, DayType } from '../../../src/types/enums';

describe('Account Deletion Flow Integration', () => {
  let ingestionService: EventIngestionService;
  let patternService: PatternDetectionService;
  let coPresenceService: CoPresenceDetectionService;
  let proposalService: WindowProposalService;
  let decisionService: WindowDecisionService;
  let activeWindowService: ActiveWindowService;
  let recognitionService: RecognitionService;
  let revelationService: RevelationService;
  let deletionService: AccountDeletionService;

  let eventRepo: EventRepository;
  let patternRepo: PatternRepository;
  let coPresenceRepo: CoPresenceRepository;
  let proposalRepo: WindowProposalRepository;
  let cooldownRepo: CooldownRepository;
  let proposalStateRepo: ProposalStateRepository;
  let userRepo: UserRepository;
  let blockRepo: BlockRepository;
  let reportRepo: ReportRepository;
  let activeWindowRepo: ActiveWindowRepository;
  let recognitionRepo: RecognitionRepository;
  let revelationRepo: RevelationRepository;
  let conversationRepo: ConversationRepository;

  beforeEach(() => {
    eventRepo = new EventRepository();
    patternRepo = new PatternRepository();
    coPresenceRepo = new CoPresenceRepository();
    proposalRepo = new WindowProposalRepository();
    cooldownRepo = new CooldownRepository();
    proposalStateRepo = new ProposalStateRepository();
    userRepo = new UserRepository();
    blockRepo = new BlockRepository();
    reportRepo = new ReportRepository();
    activeWindowRepo = new ActiveWindowRepository();
    recognitionRepo = new RecognitionRepository();
    revelationRepo = new RevelationRepository();
    conversationRepo = new ConversationRepository();

    ingestionService = new EventIngestionService(eventRepo, new AbstractEventValidator());
    patternService = new PatternDetectionService(eventRepo, patternRepo);
    coPresenceService = new CoPresenceDetectionService(patternRepo, eventRepo, coPresenceRepo, blockRepo, reportRepo, proposalStateRepo);
    proposalService = new WindowProposalService(proposalRepo, cooldownRepo, proposalStateRepo, coPresenceRepo, patternRepo);
    decisionService = new WindowDecisionService(proposalRepo, cooldownRepo, proposalStateRepo, coPresenceRepo);
    activeWindowService = new ActiveWindowService(activeWindowRepo);
    revelationService = new RevelationService(revelationRepo, activeWindowRepo, recognitionRepo);
    recognitionService = new RecognitionService(activeWindowRepo, recognitionRepo, revelationService);
    deletionService = new AccountDeletionService(
      eventRepo, patternRepo, coPresenceRepo, proposalRepo,
      activeWindowRepo, recognitionRepo, revelationRepo,
      conversationRepo, cooldownRepo, proposalStateRepo, userRepo
    );
  });

  it('should complete flow until revelation and then delete account with systemic effects', async () => {
    const now = new Date('2026-01-10T10:00:00Z');
    const users = ['userA', 'userB'];

    // 1. Ingest events -> patterns -> copresences -> proposals -> ambos aceptan -> active window -> ambos confirman -> revelation
    for (const userId of users) {
      for (let i = 0; i < 3; i++) {
        await ingestionService.ingest(userId, {
          place_category: PlaceCategory.CAFE, time_bucket: TimeBucket.MORNING,
          day_type: DayType.WEEKDAY, duration_bucket: 'medium' as any, week_id: `2026-W0${i + 1}`
        });
      }
      await patternService.detectForUser(userId);
    }
    await coPresenceService.detectForUsers(users);
    const proposals = await proposalService.generateFromCoPresences(now);
    const proposal = proposals[0];
    await decisionService.accept(proposal.id, 'userA', now);
    await decisionService.accept(proposal.id, 'userB', now);
    const windowTime = new Date('2026-01-12T09:15:00Z');
    const activeWindow = await activeWindowService.activateFromProposal(await proposalRepo.findById(proposal.id) as any, windowTime);
    await recognitionService.confirm(activeWindow.id, 'userA', windowTime);
    await recognitionService.confirm(activeWindow.id, 'userB', windowTime);

    const revelationsA = await revelationService.getRevelationForUser('userA', windowTime);
    const revelation = revelationsA[0];

    // 2. B bloquea a A (para verificar que se conserva tras borrar A)
    await blockRepo.save({ id: 'blk-ba', blocker_user_id: 'userB', blocked_user_id: 'userA', created_at: windowTime });

    // 3. A elimina cuenta
    await deletionService.deleteAccount('userA', windowTime);

    // Assertions
    expect(await userRepo.findById('userA')).toBeNull();
    expect(await revelationRepo.findById(revelation.id)).toBeNull();
    
    // 4. Nueva detección de copresencias no vuelve a emparejar A-B
    const detected = await coPresenceService.detectForUsers(['userA', 'userB']);
    expect(detected).toHaveLength(0);

    // 5. Bloqueo de B hacia A sigue existiendo
    expect(await blockRepo.existsBlock('userB', 'userA')).toBe(true);
  });
});
