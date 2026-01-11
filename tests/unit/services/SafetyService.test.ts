import { SafetyService } from '../../../src/application/services/SafetyService';
import { BlockRepository } from '../../../src/infrastructure/persistence/memory/BlockRepository';
import { ReportRepository } from '../../../src/infrastructure/persistence/memory/ReportRepository';
import { RevelationRepository } from '../../../src/infrastructure/persistence/memory/RevelationRepository';
import { ConversationRepository } from '../../../src/infrastructure/persistence/memory/ConversationRepository';
import { CoPresenceRepository } from '../../../src/infrastructure/persistence/memory/CoPresenceRepository';
import { WindowProposalRepository } from '../../../src/infrastructure/persistence/memory/WindowProposalRepository';
import { ProposalStateRepository } from '../../../src/infrastructure/persistence/memory/ProposalStateRepository';
import { ActiveWindowRepository } from '../../../src/infrastructure/persistence/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../../src/infrastructure/persistence/memory/RecognitionRepository';
import { PatternRepository } from '../../../src/infrastructure/persistence/memory/PatternRepository';
import { EventRepository } from '../../../src/infrastructure/persistence/memory/EventRepository';
import { CoPresenceDetectionService } from '../../../src/application/services/events/CoPresenceDetectionService';

import { Revelation } from '../../../src/domain/models/Revelation';
import { LatentCoPresence } from '../../../src/domain/models/LatentCoPresence';
import { WindowProposal } from '../../../src/domain/models/WindowProposal';
import { ActiveWindow } from '../../../src/domain/models/ActiveWindow';
import { PlaceCategory, TimeBucket, DayType, LatentCoPresenceStatus, PatternStatus } from '../../../src/domain/types/enums';

describe('SafetyService', () => {
  let service: SafetyService;
  let blockRepo: BlockRepository;
  let reportRepo: ReportRepository;
  let revelationRepo: RevelationRepository;
  let conversationRepo: ConversationRepository;
  let coPresenceRepo: CoPresenceRepository;
  let proposalRepo: WindowProposalRepository;
  let proposalStateRepo: ProposalStateRepository;
  let activeWindowRepo: ActiveWindowRepository;
  let recognitionRepo: RecognitionRepository;
  let patternRepo: PatternRepository;
  let eventRepo: EventRepository;

  beforeEach(() => {
    blockRepo = new BlockRepository();
    reportRepo = new ReportRepository();
    revelationRepo = new RevelationRepository();
    conversationRepo = new ConversationRepository();
    coPresenceRepo = new CoPresenceRepository();
    proposalRepo = new WindowProposalRepository();
    proposalStateRepo = new ProposalStateRepository();
    activeWindowRepo = new ActiveWindowRepository();
    recognitionRepo = new RecognitionRepository();
    patternRepo = new PatternRepository();
    eventRepo = new EventRepository();

    service = new SafetyService(
      blockRepo,
      reportRepo,
      revelationRepo,
      conversationRepo,
      coPresenceRepo,
      proposalRepo,
      proposalStateRepo,
      activeWindowRepo,
      recognitionRepo
    );
  });

  it('1) Bloquear cierra revelación y conversación', async () => {
    const now = new Date();
    const userA = 'userA';
    const userB = 'userB';

    const revelation: Revelation = {
      id: 'rev1',
      user_a_id: userA,
      user_b_id: userB,
      pattern_summary: 'test',
      revealed_at: now,
      expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      status: 'active'
    };
    await revelationRepo.save(revelation);

    await conversationRepo.save({
      id: 'msg1',
      revelation_id: 'rev1',
      sender_user_id: userA,
      text: 'Hola',
      created_at: now
    });

    await service.blockUser(userA, userB, now);

    const updatedRev = await revelationRepo.findById('rev1');
    expect(updatedRev?.status).toBe('expired');
    const messages = await conversationRepo.findByRevelationId('rev1');
    expect(messages).toHaveLength(0);
    expect(await blockRepo.existsBlock(userA, userB)).toBe(true);
  });

  it('2) Bloquear impide futuras copresencias', async () => {
    const now = new Date();
    const userA = 'userA';
    const userB = 'userB';

    // Seed events/patterns
    await patternRepo.save({
      pattern_id: 'pA', user_id: userA, place_category: PlaceCategory.CAFE, time_bucket: TimeBucket.MORNING,
      day_type: DayType.WEEKDAY, occurrences_count: 3, first_week_id: 'w1', last_week_id: 'w1',
      pattern_status: PatternStatus.ACTIVE, detected_at: now
    });
    await patternRepo.save({
      pattern_id: 'pB', user_id: userB, place_category: PlaceCategory.CAFE, time_bucket: TimeBucket.MORNING,
      day_type: DayType.WEEKDAY, occurrences_count: 3, first_week_id: 'w1', last_week_id: 'w1',
      pattern_status: PatternStatus.ACTIVE, detected_at: now
    });
    await eventRepo.save({
      id: 'eA', user_id: userA, place_category: PlaceCategory.CAFE, time_bucket: TimeBucket.MORNING,
      day_type: DayType.WEEKDAY, duration_bucket: 'medium', week_id: 'w1', created_at: now, status: 'processed'
    });
    await eventRepo.save({
      id: 'eB', user_id: userB, place_category: PlaceCategory.CAFE, time_bucket: TimeBucket.MORNING,
      day_type: DayType.WEEKDAY, duration_bucket: 'medium', week_id: 'w1', created_at: now, status: 'processed'
    });

    // Crear Block
    await blockRepo.save({ id: 'blk1', blocker_user_id: userA, blocked_user_id: userB, created_at: now });

    const detectionService = new CoPresenceDetectionService(patternRepo, eventRepo, coPresenceRepo, blockRepo, reportRepo, proposalStateRepo);
    const detected = await detectionService.detectForUsers([userA, userB]);

    expect(detected).toHaveLength(0);
  });

  it('3) Reportar crea reporte mínimo y bloquea', async () => {
    const now = new Date();
    const userA = 'userA';
    const userB = 'userB';

    // Necesitamos revelación para reportar según reglas
    await revelationRepo.save({
      id: 'rev1', user_a_id: userA, user_b_id: userB, pattern_summary: 'test',
      revealed_at: now, expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), status: 'active'
    });

    await service.reportUser(userA, userB, 'harassment', now);

    const reports = await reportRepo.listByReporter(userA);
    expect(reports).toHaveLength(1);
    expect(reports[0].reason).toBe('harassment');
    expect(await blockRepo.existsBlock(userA, userB)).toBe(true);
  });

  it('4) Bloquear cancela propuesta activa y libera ProposalState', async () => {
    const now = new Date();
    const userA = 'userA';
    const userB = 'userB';

    await revelationRepo.save({
      id: 'rev1', user_a_id: userA, user_b_id: userB, pattern_summary: 'test',
      revealed_at: now, expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), status: 'active'
    });

    const prop: WindowProposal = {
      id: 'prop1', userA_id: userA, userB_id: userB, place_category: PlaceCategory.CAFE,
      time_bucket: TimeBucket.MORNING, day_type: DayType.WEEKDAY, proposed_date: '2026-01-12',
      start_time: '09:00', end_time: '09:30', status: 'pending', acceptA: false, acceptB: false,
      declined_by: null, created_at: now
    };
    await proposalRepo.save(prop);
    await proposalStateRepo.setActiveProposal(userA, true);
    await proposalStateRepo.setActiveProposal(userB, true);

    await service.blockUser(userA, userB, now);

    const updatedProp = await proposalRepo.findById('prop1');
    expect(updatedProp?.status).toBe('expired'); // Usamos 'expired' como consistente con cancelado
    expect(await proposalStateRepo.hasActiveProposal(userA)).toBe(false);
    expect(await proposalStateRepo.hasActiveProposal(userB)).toBe(false);
  });

  it('5) Bloquear cierra ventana activa y purga recognition', async () => {
    const now = new Date();
    const userA = 'userA';
    const userB = 'userB';

    await revelationRepo.save({
      id: 'rev1', user_a_id: userA, user_b_id: userB, pattern_summary: 'test',
      revealed_at: now, expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), status: 'active'
    });

    const aw: ActiveWindow = {
      id: 'aw1', proposal_id: 'prop1', user_a_id: userA, user_b_id: userB,
      start_time: now, end_time: now, status: 'active', created_at: now
    };
    await activeWindowRepo.save(aw);

    await recognitionRepo.save({
      id: 'rec1', active_window_id: 'aw1', user_id: userA, created_at: now, status: 'confirmed'
    });

    await service.blockUser(userA, userB, now);

    const updatedAW = await activeWindowRepo.findById('aw1');
    expect(updatedAW?.status).toBe('completed');
    const recognitions = await recognitionRepo.findByWindow('aw1');
    expect(recognitions).toHaveLength(0);
  });
});
