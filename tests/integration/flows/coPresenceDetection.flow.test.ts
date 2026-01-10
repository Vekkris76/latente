import { EventRepository } from '../../../src/repositories/EventRepository';
import { PatternRepository } from '../../../src/repositories/PatternRepository';
import { CoPresenceRepository } from '../../../src/repositories/CoPresenceRepository';
import { BlockRepository } from '../../../src/repositories/BlockRepository';
import { ReportRepository } from '../../../src/repositories/ReportRepository';
import { ProposalStateRepository } from '../../../src/repositories/ProposalStateRepository';
import { EventIngestionService } from '../../../src/services/events/EventIngestionService';
import { PatternDetectionService } from '../../../src/services/events/PatternDetectionService';
import { CoPresenceDetectionService } from '../../../src/services/events/CoPresenceDetectionService';
import { AbstractEventValidator } from '../../../src/validation/AbstractEventValidator';
import { AbstractEventInput } from '../../../src/types/AbstractEvent.types';

describe('Co-Presence Detection Flow (Integration)', () => {
  let eventRepo: EventRepository;
  let patternRepo: PatternRepository;
  let copresenceRepo: CoPresenceRepository;
  let blockRepo: BlockRepository;
  let reportRepo: ReportRepository;
  let proposalRepo: ProposalStateRepository;
  
  let ingestionService: EventIngestionService;
  let patternService: PatternDetectionService;
  let copresenceService: CoPresenceDetectionService;
  let validator: AbstractEventValidator;

  beforeEach(() => {
    eventRepo = new EventRepository();
    patternRepo = new PatternRepository();
    copresenceRepo = new CoPresenceRepository();
    blockRepo = new BlockRepository();
    reportRepo = new ReportRepository();
    proposalRepo = new ProposalStateRepository();
    
    validator = new AbstractEventValidator();
    ingestionService = new EventIngestionService(eventRepo, validator);
    patternService = new PatternDetectionService(eventRepo, patternRepo);
    copresenceService = new CoPresenceDetectionService(
      patternRepo,
      eventRepo,
      copresenceRepo,
      blockRepo,
      reportRepo,
      proposalRepo
    );
  });

  it('should flow from ingestion to co-presence detection', async () => {
    const userA = 'user-A';
    const userB = 'user-B';

    const eventInput: AbstractEventInput = {
      time_bucket: 'morning',
      place_category: 'cafe',
      day_type: 'weekday',
      duration_bucket: 'medium',
      week_id: '2026-W01'
    };

    // 1. Ingestar eventos para User A (crea patrón)
    await ingestionService.ingest(userA, { ...eventInput, week_id: '2026-W01' });
    await ingestionService.ingest(userA, { ...eventInput, week_id: '2026-W02' });
    await ingestionService.ingest(userA, { ...eventInput, week_id: '2026-W03' });

    // 2. Ingestar eventos para User B (crea patrón con overlap)
    await ingestionService.ingest(userB, { ...eventInput, week_id: '2026-W02' });
    await ingestionService.ingest(userB, { ...eventInput, week_id: '2026-W03' });
    await ingestionService.ingest(userB, { ...eventInput, week_id: '2026-W04' });

    // 3. Detectar patrones
    await patternService.detectForUser(userA);
    await patternService.detectForUser(userB);

    // 4. Detectar co-presencias
    const detected = await copresenceService.detectForUsers([userA, userB]);

    // 5. Verificar
    expect(detected.length).toBe(1);
    expect(detected[0].shared_place_category).toBe('cafe');
    expect(detected[0].shared_time_bucket).toBe('morning');
    // Overlap debe ser W02 y W03
    expect(detected[0].overlap_week_ids).toContain('2026-W02');
    expect(detected[0].overlap_week_ids).toContain('2026-W03');
    expect(detected[0].overlap_week_ids.length).toBe(2);
  });
});
