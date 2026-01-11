import { EventIngestionService } from '../../../src/application/services/events/EventIngestionService';
import { EventRepository } from '../../../src/infrastructure/repositories/memory/EventRepository';
import { AbstractEventValidator } from '../../../src/domain/validation/AbstractEventValidator';
import { AbstractEventInput } from '../../../src/domain/types/AbstractEvent.types';

describe('Event Ingestion Flow Integration Test', () => {
  let service: EventIngestionService;
  let repository: EventRepository;
  let validator: AbstractEventValidator;

  beforeEach(() => {
    repository = new EventRepository();
    validator = new AbstractEventValidator();
    service = new EventIngestionService(repository, validator);
  });

  test('ingesta evento válido + se guarda y se recupera por id', async () => {
    const userId = 'user-123';
    const input: AbstractEventInput = {
      time_bucket: 'morning' as any,
      place_category: 'cafe' as any,
      day_type: 'weekday' as any,
      duration_bucket: 'medium' as any,
      week_id: '2026-W02'
    };

    // 1. Ingestar
    const savedEvent = await service.ingest(userId, input);

    // 2. Verificar retorno
    expect(savedEvent.id).toBeDefined();
    expect(savedEvent.user_id).toBe(userId);
    expect(savedEvent.week_id).toBe('2026-W02');
    expect(savedEvent.status).toBe('pending');

    // 3. Recuperar del repositorio
    const retrieved = await repository.findById(savedEvent.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(savedEvent.id);
    expect(retrieved?.user_id).toBe(userId);
  });

  test('rechaza evento con campo prohibido', async () => {
    const userId = 'user-123';
    const input = {
      time_bucket: 'morning',
      place_category: 'cafe',
      day_type: 'weekday',
      duration_bucket: 'medium',
      week_id: '2026-W02',
      latitude: 40.4168
    };

    await expect(service.ingest(userId, input as any)).rejects.toThrow(
      /campos prohibidos/
    );
  });
});
