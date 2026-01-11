import { EventIngestionService } from '../../../src/application/services/events/EventIngestionService';
import { PatternDetectionService } from '../../../src/application/services/events/PatternDetectionService';
import { CoPresenceDetectionService } from '../../../src/application/services/events/CoPresenceDetectionService';
import { WindowProposalService } from '../../../src/application/services/WindowProposalService';
import { EventRepository } from '../../../src/infrastructure/repositories/memory/EventRepository';
import { PatternRepository } from '../../../src/infrastructure/repositories/memory/PatternRepository';
import { CoPresenceRepository } from '../../../src/infrastructure/repositories/memory/CoPresenceRepository';
import { WindowProposalRepository } from '../../../src/infrastructure/repositories/memory/WindowProposalRepository';
import { CooldownRepository } from '../../../src/infrastructure/repositories/memory/CooldownRepository';
import { ProposalStateRepository } from '../../../src/infrastructure/repositories/memory/ProposalStateRepository';
import { UserRepository } from '../../../src/infrastructure/repositories/memory/UserRepository';
import { BlockRepository } from '../../../src/infrastructure/repositories/memory/BlockRepository';
import { ReportRepository } from '../../../src/infrastructure/repositories/memory/ReportRepository';
import { AbstractEventValidator } from '../../../src/domain/validation/AbstractEventValidator';
import { PlaceCategory, TimeBucket, DayType } from '../../../src/domain/types/enums';

describe('Window Proposal Flow Integration', () => {
  let ingestionService: EventIngestionService;
  let patternService: PatternDetectionService;
  let coPresenceService: CoPresenceDetectionService;
  let proposalService: WindowProposalService;

  let eventRepo: EventRepository;
  let patternRepo: PatternRepository;
  let coPresenceRepo: CoPresenceRepository;
  let proposalRepo: WindowProposalRepository;
  let cooldownRepo: CooldownRepository;
  let proposalStateRepo: ProposalStateRepository;
  let userRepo: UserRepository;
  let blockRepo: BlockRepository;
  let reportRepo: ReportRepository;

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

    ingestionService = new EventIngestionService(eventRepo, new AbstractEventValidator());
    patternService = new PatternDetectionService(eventRepo, patternRepo);
    coPresenceService = new CoPresenceDetectionService(patternRepo, eventRepo, coPresenceRepo, blockRepo, reportRepo, proposalStateRepo);
    proposalService = new WindowProposalService(proposalRepo, cooldownRepo, proposalStateRepo, coPresenceRepo, patternRepo);
  });

  it('should complete the full flow from events to proposal without revealing identity', async () => {
    const now = new Date('2026-01-10T10:00:00Z'); // Sábado
    const weekId = '2026-01';

    // 1. Ingesta de eventos para dos usuarios que coinciden en patrón
    const users = ['userA', 'userB'];
    for (const userId of users) {
      for (let i = 0; i < 3; i++) {
        // Usar weekId diferentes para cumplir con la lógica de deduplicación si es necesario,
        // pero aquí el servicio de patrones agrupa por week_id|day_type|...
        // Para tener 3 coincidencias reales necesitamos 3 semanas o 3 días distintos.
        // El validador de eventos requiere weekId.
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

    // 5. Verificaciones
    expect(proposals).toHaveLength(1);
    const proposal = proposals[0];
    
    expect(proposal.userA_id).toBe('userA');
    expect(proposal.userB_id).toBe('userB');
    expect(proposal.place_category).toBe(PlaceCategory.CAFE);
    expect(proposal.time_bucket).toBe(TimeBucket.MORNING);
    
    // Verificación de NO revelación de identidad
    const proposalKeys = Object.keys(proposal);
    const forbiddenIdentityFields = ['name', 'photo', 'email', 'profile', 'bio', 'username'];
    forbiddenIdentityFields.forEach(field => {
      expect(proposalKeys).not.toContain(field);
    });

    // Verificar que el estado de la co-presencia cambió
    const coPresences = await coPresenceRepo.findAll();
    expect(coPresences[0].status).toBe('proposed');
  });
});
