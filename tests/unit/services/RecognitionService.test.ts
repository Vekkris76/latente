import { RecognitionService } from '../../../src/application/services/RecognitionService';
import { ActiveWindowRepository } from '../../../src/infrastructure/persistence/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../../src/infrastructure/persistence/memory/RecognitionRepository';
import { RevelationService } from '../../../src/application/services/RevelationService';
import { RevelationRepository } from '../../../src/infrastructure/persistence/memory/RevelationRepository';
import { ActiveWindow } from '../../../src/domain/models/ActiveWindow';

describe('RecognitionService', () => {
  let service: RecognitionService;
  let activeWindowRepo: ActiveWindowRepository;
  let recognitionRepo: RecognitionRepository;
  let revelationRepo: RevelationRepository;
  let revelationService: RevelationService;

  beforeEach(() => {
    activeWindowRepo = new ActiveWindowRepository();
    recognitionRepo = new RecognitionRepository();
    revelationRepo = new RevelationRepository();
    revelationService = new RevelationService(revelationRepo, activeWindowRepo, recognitionRepo);
    service = new RecognitionService(activeWindowRepo, recognitionRepo, revelationService);
  });

  const createActiveWindow = async (now: Date): Promise<ActiveWindow> => {
    const window: ActiveWindow = {
      id: 'aw1',
      proposal_id: 'win1',
      user_a_id: 'userA',
      user_b_id: 'userB',
      start_time: new Date(now.getTime() - 10 * 60 * 1000), // Hace 10 min
      end_time: new Date(now.getTime() + 20 * 60 * 1000),  // En 20 min
      status: 'active',
      created_at: now
    };
    return await activeWindowRepo.save(window);
  };

  it('should confirm within active window', async () => {
    const now = new Date('2026-01-12T09:15:00Z');
    await createActiveWindow(now);

    const recognition = await service.confirm('aw1', 'userA', now);
    expect(recognition.user_id).toBe('userA');
    expect(recognition.status).toBe('confirmed');
  });

  it('should not allow double confirmation', async () => {
    const now = new Date('2026-01-12T09:15:00Z');
    await createActiveWindow(now);

    await service.confirm('aw1', 'userA', now);
    await expect(service.confirm('aw1', 'userA', now)).rejects.toThrow('User already confirmed');
  });

  it('should not allow confirmation outside of window time', async () => {
    const now = new Date('2026-01-12T09:15:00Z');
    await createActiveWindow(now);

    const tooLate = new Date('2026-01-12T10:00:00Z');
    await expect(service.confirm('aw1', 'userA', tooLate)).rejects.toThrow('Outside of active window time');
  });

  it('should not reveal if only one user confirms', async () => {
    const now = new Date('2026-01-12T09:15:00Z');
    await createActiveWindow(now);

    await service.confirm('aw1', 'userA', now);
    const revelations = await revelationRepo.findActiveByUser('userA');
    expect(revelations).toHaveLength(0);
  });

  it('should create immediate revelation when both users confirm', async () => {
    const now = new Date('2026-01-12T09:15:00Z');
    const window = await createActiveWindow(now);

    await service.confirm('aw1', 'userA', now);
    await service.confirm('aw1', 'userB', now);

    const revelations = await revelationRepo.findActiveByUser('userA');
    expect(revelations).toHaveLength(1);
    expect(revelations[0].user_a_id).toBe('userA');
    expect(revelations[0].user_b_id).toBe('userB');
    expect(revelations[0].status).toBe('active');

    const updatedWindow = await activeWindowRepo.findById('aw1');
    expect(updatedWindow?.status).toBe('completed');

    const recognitions = await recognitionRepo.findByWindow('aw1');
    expect(recognitions).toHaveLength(0); // Purged
  });
});
