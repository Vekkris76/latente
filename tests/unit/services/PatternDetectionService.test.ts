import { EventRepository } from '../../../src/infrastructure/repositories/memory/EventRepository';
import { PatternRepository } from '../../../src/infrastructure/repositories/memory/PatternRepository';
import { PatternDetectionService } from '../../../src/application/services/events/PatternDetectionService';
import { AbstractEvent } from '../../../src/domain/types/AbstractEvent.types';

describe('PatternDetectionService', () => {
  let eventRepo: EventRepository;
  let patternRepo: PatternRepository;
  let service: PatternDetectionService;

  beforeEach(() => {
    eventRepo = new EventRepository();
    patternRepo = new PatternRepository();
    service = new PatternDetectionService(eventRepo, patternRepo);
  });

  const createEvent = (overrides: Partial<AbstractEvent>): AbstractEvent => ({
    id: Math.random().toString(36).substring(7),
    user_id: 'user1',
    time_bucket: 'morning',
    place_category: 'cafe',
    day_type: 'weekday',
    duration_bucket: 'medium',
    week_id: '2026-W01',
    created_at: new Date(),
    status: 'pending',
    ...overrides
  });

  it('should detect a pattern with 3 events in 3 consecutive weeks', async () => {
    await eventRepo.save(createEvent({ week_id: '2026-W01' }));
    await eventRepo.save(createEvent({ week_id: '2026-W02' }));
    await eventRepo.save(createEvent({ week_id: '2026-W03' }));

    const patterns = await service.detectForUser('user1');

    expect(patterns.length).toBe(1);
    expect(patterns[0].occurrences_count).toBe(3);
    expect(patterns[0].first_week_id).toBe('2026-W01');
    expect(patterns[0].last_week_id).toBe('2026-W03');
  });

  it('should NOT detect a pattern with only 2 events', async () => {
    await eventRepo.save(createEvent({ week_id: '2026-W01' }));
    await eventRepo.save(createEvent({ week_id: '2026-W02' }));

    const patterns = await service.detectForUser('user1');

    expect(patterns.length).toBe(0);
  });

  it('should NOT detect a pattern if span is > 4 weeks', async () => {
    await eventRepo.save(createEvent({ week_id: '2026-W01' }));
    await eventRepo.save(createEvent({ week_id: '2026-W02' }));
    await eventRepo.save(createEvent({ week_id: '2026-W06' }));

    const patterns = await service.detectForUser('user1');

    expect(patterns.length).toBe(0);
  });

  it('should deduplicate events in the same week and day_type (accumulation in one day)', async () => {
    // 3 eventos en la misma semana, mismo day_type -> cuentan como 1
    await eventRepo.save(createEvent({ week_id: '2026-W01', id: 'e1' }));
    await eventRepo.save(createEvent({ week_id: '2026-W01', id: 'e2' }));
    await eventRepo.save(createEvent({ week_id: '2026-W01', id: 'e3' }));
    
    // Necesitamos 2 semanas más para llegar a 3 coincidencias
    await eventRepo.save(createEvent({ week_id: '2026-W02' }));
    await eventRepo.save(createEvent({ week_id: '2026-W03' }));

    const patterns = await service.detectForUser('user1');

    expect(patterns.length).toBe(1);
    expect(patterns[0].occurrences_count).toBe(3);
  });

  it('should NOT detect patterns for "transport" category', async () => {
    await eventRepo.save(createEvent({ week_id: '2026-W01', place_category: 'transport' }));
    await eventRepo.save(createEvent({ week_id: '2026-W02', place_category: 'transport' }));
    await eventRepo.save(createEvent({ week_id: '2026-W03', place_category: 'transport' }));

    const patterns = await service.detectForUser('user1');

    expect(patterns.length).toBe(0);
  });

  it('should detect pattern with 4 events in 4 weeks', async () => {
    await eventRepo.save(createEvent({ week_id: '2026-W01' }));
    await eventRepo.save(createEvent({ week_id: '2026-W02' }));
    await eventRepo.save(createEvent({ week_id: '2026-W03' }));
    await eventRepo.save(createEvent({ week_id: '2026-W04' }));

    const patterns = await service.detectForUser('user1');

    expect(patterns.length).toBe(1);
    expect(patterns[0].occurrences_count).toBe(4);
    expect(patterns[0].first_week_id).toBe('2026-W01');
    expect(patterns[0].last_week_id).toBe('2026-W04');
  });

  it('should NOT be affected by duration_bucket', async () => {
    // Mismos eventos pero con diferentes duraciones
    await eventRepo.save(createEvent({ week_id: '2026-W01', duration_bucket: 'short' }));
    await eventRepo.save(createEvent({ week_id: '2026-W02', duration_bucket: 'medium' }));
    await eventRepo.save(createEvent({ week_id: '2026-W03', duration_bucket: 'long' }));

    const patterns = await service.detectForUser('user1');

    expect(patterns.length).toBe(1);
    expect(patterns[0].occurrences_count).toBe(3);
  });
});
