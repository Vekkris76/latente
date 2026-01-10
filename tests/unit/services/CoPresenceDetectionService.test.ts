import { PatternRepository } from '../../../src/repositories/PatternRepository';
import { CoPresenceRepository } from '../../../src/repositories/CoPresenceRepository';
import { EventRepository } from '../../../src/repositories/EventRepository';
import { BlockRepository } from '../../../src/repositories/BlockRepository';
import { ReportRepository } from '../../../src/repositories/ReportRepository';
import { ProposalStateRepository } from '../../../src/repositories/ProposalStateRepository';
import { CoPresenceDetectionService } from '../../../src/services/events/CoPresenceDetectionService';
import { Pattern } from '../../../src/models/Pattern';
import { AbstractEvent } from '../../../src/types/AbstractEvent.types';
import { PatternStatus, LatentCoPresenceStatus } from '../../../src/types/enums';

describe('CoPresenceDetectionService', () => {
  let patternRepo: PatternRepository;
  let eventRepo: EventRepository;
  let copresenceRepo: CoPresenceRepository;
  let blockRepo: BlockRepository;
  let reportRepo: ReportRepository;
  let proposalRepo: ProposalStateRepository;
  let service: CoPresenceDetectionService;

  beforeEach(() => {
    patternRepo = new PatternRepository();
    eventRepo = new EventRepository();
    copresenceRepo = new CoPresenceRepository();
    blockRepo = new BlockRepository();
    reportRepo = new ReportRepository();
    proposalRepo = new ProposalStateRepository();
    service = new CoPresenceDetectionService(
      patternRepo,
      eventRepo,
      copresenceRepo,
      blockRepo,
      reportRepo,
      proposalRepo
    );
  });

  const createPattern = (userId: string, overrides: Partial<Pattern>): Pattern => ({
    pattern_id: `pat_${userId}_${Math.random()}`,
    user_id: userId,
    place_category: 'cafe',
    time_bucket: 'morning',
    day_type: 'weekday',
    occurrences_count: 3,
    first_week_id: '2026-W01',
    last_week_id: '2026-W03',
    pattern_status: PatternStatus.ACTIVE,
    detected_at: new Date(),
    ...overrides
  });

  const createEvent = (userId: string, overrides: Partial<AbstractEvent>): AbstractEvent => ({
    id: Math.random().toString(),
    user_id: userId,
    place_category: 'cafe',
    time_bucket: 'morning',
    day_type: 'weekday',
    duration_bucket: 'medium',
    week_id: '2026-W01',
    created_at: new Date(),
    status: 'processed',
    ...overrides
  });

  it('should detect co-presence when patterns match and there is week overlap', async () => {
    const userA = 'userA';
    const userB = 'userB';

    await patternRepo.save(createPattern(userA, {}));
    await patternRepo.save(createPattern(userB, {}));

    await eventRepo.save(createEvent(userA, { week_id: '2026-W01' }));
    await eventRepo.save(createEvent(userB, { week_id: '2026-W01' }));

    const detected = await service.detectForUsers([userA, userB]);

    expect(detected.length).toBe(1);
    expect(detected[0].shared_place_category).toBe('cafe');
    expect(detected[0].overlap_week_ids).toContain('2026-W01');
  });

  it('should NOT detect co-presence if there is no week overlap', async () => {
    const userA = 'userA';
    const userB = 'userB';

    await patternRepo.save(createPattern(userA, {}));
    await patternRepo.save(createPattern(userB, {}));

    await eventRepo.save(createEvent(userA, { week_id: '2026-W01' }));
    await eventRepo.save(createEvent(userB, { week_id: '2026-W02' }));

    const detected = await service.detectForUsers([userA, userB]);

    expect(detected.length).toBe(0);
  });

  it('should NOT detect co-presence if category is transport', async () => {
    const userA = 'userA';
    const userB = 'userB';

    await patternRepo.save(createPattern(userA, { place_category: 'transport' }));
    await patternRepo.save(createPattern(userB, { place_category: 'transport' }));

    await eventRepo.save(createEvent(userA, { place_category: 'transport', week_id: '2026-W01' }));
    await eventRepo.save(createEvent(userB, { place_category: 'transport', week_id: '2026-W01' }));

    const detected = await service.detectForUsers([userA, userB]);

    expect(detected.length).toBe(0);
  });

  it('should NOT detect co-presence if there is a block', async () => {
    const userA = 'userA';
    const userB = 'userB';

    await patternRepo.save(createPattern(userA, {}));
    await patternRepo.save(createPattern(userB, {}));
    await eventRepo.save(createEvent(userA, { week_id: '2026-W01' }));
    await eventRepo.save(createEvent(userB, { week_id: '2026-W01' }));

    await blockRepo.saveBlock(userA, userB);

    const detected = await service.detectForUsers([userA, userB]);

    expect(detected.length).toBe(0);
  });

  it('should NOT detect co-presence if there is a report', async () => {
    const userA = 'userA';
    const userB = 'userB';

    await patternRepo.save(createPattern(userA, {}));
    await patternRepo.save(createPattern(userB, {}));
    await eventRepo.save(createEvent(userA, { week_id: '2026-W01' }));
    await eventRepo.save(createEvent(userB, { week_id: '2026-W01' }));

    await reportRepo.saveReport(userA, userB);

    const detected = await service.detectForUsers([userA, userB]);

    expect(detected.length).toBe(0);
  });

  it('should NOT create duplicates when run multiple times', async () => {
    const userA = 'userA';
    const userB = 'userB';

    await patternRepo.save(createPattern(userA, {}));
    await patternRepo.save(createPattern(userB, {}));
    await eventRepo.save(createEvent(userA, { week_id: '2026-W01' }));
    await eventRepo.save(createEvent(userB, { week_id: '2026-W01' }));

    // Primera ejecución
    await service.detectForUsers([userA, userB]);
    
    // Segunda ejecución
    const detectedSecondTime = await service.detectForUsers([userA, userB]);

    expect(detectedSecondTime.length).toBe(0); // Ya existía, no se crea de nuevo
    const all = await copresenceRepo.findAll();
    expect(all.length).toBe(1);
  });

  it('should respect the limit of 2 co-presences per user', async () => {
    const userA = 'userA';
    const userB = 'userB';
    const userC = 'userC';
    const userD = 'userD';

    // User A con B
    await patternRepo.save(createPattern(userA, { pattern_id: 'pA1' }));
    await patternRepo.save(createPattern(userB, { pattern_id: 'pB1' }));
    await eventRepo.save(createEvent(userA, { week_id: '2026-W01' }));
    await eventRepo.save(createEvent(userB, { week_id: '2026-W01' }));

    // User A con C
    await patternRepo.save(createPattern(userC, { pattern_id: 'pC1', time_bucket: 'evening' }));
    await patternRepo.save(createPattern(userA, { pattern_id: 'pA2', time_bucket: 'evening' }));
    await eventRepo.save(createEvent(userA, { week_id: '2026-W01', time_bucket: 'evening' }));
    await eventRepo.save(createEvent(userC, { week_id: '2026-W01', time_bucket: 'evening' }));

    // User A con D (debería fallar por límite de 2)
    await patternRepo.save(createPattern(userD, { pattern_id: 'pD1', place_category: 'gym' }));
    await patternRepo.save(createPattern(userA, { pattern_id: 'pA3', place_category: 'gym' }));
    await eventRepo.save(createEvent(userA, { week_id: '2026-W01', place_category: 'gym' }));
    await eventRepo.save(createEvent(userD, { week_id: '2026-W01', place_category: 'gym' }));

    const detected = await service.detectForUsers([userA, userB, userC, userD]);

    // Debería haber detectado A-B y A-C, pero no A-D
    const activeA = await copresenceRepo.findActiveByUser(userA);
    expect(activeA.length).toBe(2);
    
    const hasAD = activeA.some(cp => cp.user_a_id === userD || cp.user_b_id === userD);
    expect(hasAD).toBe(false);
  });

  it('should NOT detect co-presence if user has an active proposal', async () => {
    const userA = 'userA';
    const userB = 'userB';

    await patternRepo.save(createPattern(userA, {}));
    await patternRepo.save(createPattern(userB, {}));
    await eventRepo.save(createEvent(userA, { week_id: '2026-W01' }));
    await eventRepo.save(createEvent(userB, { week_id: '2026-W01' }));

    await proposalRepo.setActiveProposal(userA, true);

    const detected = await service.detectForUsers([userA, userB]);

    expect(detected.length).toBe(0);
  });
});
