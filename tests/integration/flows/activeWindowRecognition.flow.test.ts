import { EventIngestionService } from '../../../src/application/services/events/EventIngestionService';
import { PatternDetectionService } from '../../../src/application/services/events/PatternDetectionService';
import { CoPresenceDetectionService } from '../../../src/application/services/events/CoPresenceDetectionService';
import { WindowProposalService } from '../../../src/application/services/WindowProposalService';
import { WindowDecisionService } from '../../../src/application/services/WindowDecisionService';
import { ActiveWindowService } from '../../../src/application/services/ActiveWindowService';
import { RecognitionService } from '../../../src/application/services/RecognitionService';
import { RevelationService } from '../../../src/application/services/RevelationService';

import { EventRepository } from '../../../src/infrastructure/repositories/memory/EventRepository';
import { PatternRepository } from '../../../src/infrastructure/repositories/memory/PatternRepository';
import { CoPresenceRepository } from '../../../src/infrastructure/repositories/memory/CoPresenceRepository';
import { WindowProposalRepository } from '../../../src/infrastructure/repositories/memory/WindowProposalRepository';
import { CooldownRepository } from '../../../src/infrastructure/repositories/memory/CooldownRepository';
import { ProposalStateRepository } from '../../../src/infrastructure/repositories/memory/ProposalStateRepository';
import { UserRepository } from '../../../src/infrastructure/repositories/memory/UserRepository';
import { BlockRepository } from '../../../src/infrastructure/repositories/memory/BlockRepository';
import { ReportRepository } from '../../../src/infrastructure/repositories/memory/ReportRepository';
import { ActiveWindowRepository } from '../../../src/infrastructure/repositories/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../../src/infrastructure/repositories/memory/RecognitionRepository';
import { RevelationRepository } from '../../../src/infrastructure/repositories/memory/RevelationRepository';
import { ConversationRepository } from '../../../src/infrastructure/repositories/memory/ConversationRepository';

import { AbstractEventValidator } from '../../../src/domain/validation/AbstractEventValidator';
import { PlaceCategory, TimeBucket, DayType } from '../../../src/domain/types/enums';

describe('Active Window & Recognition Flow Integration', () => {
  let ingestionService: EventIngestionService;
  let patternService: PatternDetectionService;
  let coPresenceService: CoPresenceDetectionService;
  let proposalService: WindowProposalService;
  let decisionService: WindowDecisionService;
  let activeWindowService: ActiveWindowService;
  let recognitionService: RecognitionService;
  let revelationService: RevelationService;

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
  });

  it('should complete the full flow from events to revelation', async () => {
    const now = new Date('2026-01-10T10:00:00Z'); // Sábado
    const users = ['userA', 'userB'];

    // 1. Ingesta de eventos
    for (const userId of users) {
      for (let i = 0; i < 3; i++) {
        await ingestionService.ingest(userId, {
          place_category: PlaceCategory.CAFE,
          time_bucket: TimeBucket.MORNING,
          day_type: DayType.WEEKDAY,
          duration_bucket: 'medium' as any,
          week_id: `2026-W0${i + 1}`
        });
      }
    }

    // 2. Detectar patrones
    for (const userId of users) {
      await patternService.detectForUser(userId);
    }

    // 3. Detectar co-presencias
    await coPresenceService.detectForUsers(users);

    // 4. Generar propuestas
    const proposals = await proposalService.generateFromCoPresences(now);
    expect(proposals).toHaveLength(1);
    const proposal = proposals[0];

    // 5. Ambos aceptan
    await decisionService.accept(proposal.id, 'userA', now);
    await decisionService.accept(proposal.id, 'userB', now);
    
    const updatedProposal = await proposalRepo.findById(proposal.id);
    expect(updatedProposal?.status).toBe('activated');

    // 6. Ventana activa (Simulamos que llega el momento de la ventana)
    const windowTime = new Date('2026-01-12T09:15:00Z'); // Lunes a las 09:15
    const activeWindow = await activeWindowService.activateFromProposal(updatedProposal!, windowTime);
    expect(activeWindow.status).toBe('active');

    // 7. Ambos confirman
    await recognitionService.confirm(activeWindow.id, 'userA', windowTime);
    await recognitionService.confirm(activeWindow.id, 'userB', windowTime);

    // 8. Revelación creada
    const revelationsA = await revelationService.getRevelationForUser('userA', windowTime);
    expect(revelationsA).toHaveLength(1);
    const revelation = revelationsA[0];
    expect(revelation.user_a_id).toBe('userA');
    expect(revelation.user_b_id).toBe('userB');
    expect(revelation.status).toBe('active');

    // Verificación de NO revelación de identidad antes de este punto (ya verificado en otros tests, pero aquí aseguramos que la revelación tiene lo justo)
    const forbiddenFields = ['gps', 'location', 'precise_timestamp'];
    const revelationKeys = Object.keys(revelation);
    forbiddenFields.forEach(field => {
      expect(revelationKeys).not.toContain(field);
    });

    // 9. Conversación permitida
    await conversationRepo.save({
      id: 'msg1',
      revelation_id: revelation.id,
      sender_user_id: 'userA',
      text: '¡Hola! Te vi en el café.',
      created_at: windowTime
    });

    const messages = await conversationRepo.findByRevelationId(revelation.id);
    expect(messages).toHaveLength(1);
    expect(messages[0].text).toBe('¡Hola! Te vi en el café.');
  });
});
