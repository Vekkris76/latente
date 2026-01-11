import { EventRepository } from '../../../src/infrastructure/repositories/memory/EventRepository';
import { PatternRepository } from '../../../src/infrastructure/repositories/memory/PatternRepository';
import { EventIngestionService } from '../../../src/application/services/events/EventIngestionService';
import { PatternDetectionService } from '../../../src/application/services/events/PatternDetectionService';
import { AbstractEventValidator } from '../../../src/domain/validation/AbstractEventValidator';
import { AbstractEventInput } from '../../../src/domain/types/AbstractEvent.types';

describe('Pattern Detection Flow (Integration)', () => {
  let eventRepo: EventRepository;
  let patternRepo: PatternRepository;
  let ingestionService: EventIngestionService;
  let detectionService: PatternDetectionService;
  let validator: AbstractEventValidator;

  beforeEach(() => {
    eventRepo = new EventRepository();
    patternRepo = new PatternRepository();
    validator = new AbstractEventValidator();
    ingestionService = new EventIngestionService(eventRepo, validator);
    detectionService = new PatternDetectionService(eventRepo, patternRepo);
  });

  const userId = 'user-integration-test';

  it('should ingest events and detect a pattern', async () => {
    const eventInput: AbstractEventInput = {
      time_bucket: 'morning',
      place_category: 'cafe',
      day_type: 'weekday',
      duration_bucket: 'medium',
      week_id: '2026-W01'
    };

    // Ingestar 3 eventos en 3 semanas diferentes
    await ingestionService.ingest(userId, { ...eventInput, week_id: '2026-W01' });
    await ingestionService.ingest(userId, { ...eventInput, week_id: '2026-W02' });
    await ingestionService.ingest(userId, { ...eventInput, week_id: '2026-W03' });

    // Ejecutar detección
    const patterns = await detectionService.detectForUser(userId);

    // Verificar resultados
    expect(patterns.length).toBe(1);
    expect(patterns[0].user_id).toBe(userId);
    expect(patterns[0].place_category).toBe('cafe');
    expect(patterns[0].time_bucket).toBe('morning');
    expect(patterns[0].occurrences_count).toBe(3);

    // Verificar persistencia en repositorio
    const savedPatterns = await patternRepo.findAllByUser(userId);
    expect(savedPatterns.length).toBe(1);
    expect(savedPatterns[0].pattern_id).toBe(patterns[0].pattern_id);
  });

  it('should handle multiple users independently', async () => {
    const userA = 'user-A';
    const userB = 'user-B';

    const eventInput: AbstractEventInput = {
      time_bucket: 'evening',
      place_category: 'gym',
      day_type: 'weekday',
      duration_bucket: 'short',
      week_id: '2026-W01'
    };

    // User A cumple patrón
    await ingestionService.ingest(userA, { ...eventInput, week_id: '2026-W01' });
    await ingestionService.ingest(userA, { ...eventInput, week_id: '2026-W02' });
    await ingestionService.ingest(userA, { ...eventInput, week_id: '2026-W03' });

    // User B solo tiene 2 eventos
    await ingestionService.ingest(userB, { ...eventInput, week_id: '2026-W01' });
    await ingestionService.ingest(userB, { ...eventInput, week_id: '2026-W02' });

    const patternsA = await detectionService.detectForUser(userA);
    const patternsB = await detectionService.detectForUser(userB);

    expect(patternsA.length).toBe(1);
    expect(patternsB.length).toBe(0);
  });
});
