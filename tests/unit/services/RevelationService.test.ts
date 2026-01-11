import { RevelationService } from '../../../src/application/services/RevelationService';
import { PurgeService } from '../../../src/application/services/PurgeService';
import { RevelationRepository } from '../../../src/infrastructure/repositories/memory/RevelationRepository';
import { ActiveWindowRepository } from '../../../src/infrastructure/repositories/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../../src/infrastructure/repositories/memory/RecognitionRepository';
import { ConversationRepository } from '../../../src/infrastructure/repositories/memory/ConversationRepository';
import { ActiveWindow } from '../../../src/domain/models/ActiveWindow';
import { Recognition } from '../../../src/domain/models/Recognition';

describe('RevelationService & PurgeService', () => {
  let revelationService: RevelationService;
  let purgeService: PurgeService;
  let revelationRepo: RevelationRepository;
  let activeWindowRepo: ActiveWindowRepository;
  let recognitionRepo: RecognitionRepository;
  let conversationRepo: ConversationRepository;

  beforeEach(() => {
    revelationRepo = new RevelationRepository();
    activeWindowRepo = new ActiveWindowRepository();
    recognitionRepo = new RecognitionRepository();
    conversationRepo = new ConversationRepository();
    revelationService = new RevelationService(revelationRepo, activeWindowRepo, recognitionRepo);
    purgeService = new PurgeService(recognitionRepo, revelationRepo, conversationRepo);
  });

  it('should expire revelation after 7 days and purge conversation', async () => {
    const now = new Date('2026-01-12T09:15:00Z');
    const window: ActiveWindow = {
      id: 'aw1',
      proposal_id: 'win1',
      user_a_id: 'userA',
      user_b_id: 'userB',
      start_time: now,
      end_time: now,
      status: 'active',
      created_at: now
    };

    const revelation = await revelationService.createFromActiveWindow(window, now);
    expect(revelation.expires_at.getTime()).toBe(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Add a message
    await conversationRepo.save({
      id: 'msg1',
      revelation_id: revelation.id,
      sender_user_id: 'userA',
      text: 'Hola',
      created_at: now
    });

    // 7 days later
    const eightDaysLater = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
    await purgeService.purgeExpiredRevelations(eightDaysLater);

    const updatedRev = await revelationRepo.findById(revelation.id);
    expect(updatedRev?.status).toBe('expired');

    const messages = await conversationRepo.findByRevelationId(revelation.id);
    expect(messages).toHaveLength(0);
  });

  it('should purge unilateral recognitions after 24h', async () => {
    const now = new Date('2026-01-12T09:15:00Z');
    const recognition: Recognition = {
      id: 'rec1',
      active_window_id: 'aw1',
      user_id: 'userA',
      created_at: now,
      status: 'confirmed'
    };
    await recognitionRepo.save(recognition);

    // 25 hours later
    const twentyFiveHoursLater = new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000); // Wait, 25 hours is 25 * 60 * 60 * 1000
    // Actually 25 hours is 25 * 60 * 60 * 1000. 25 * 24 * 60 * 60 * 1000 is 25 days.
    const realTwentyFiveHoursLater = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    
    await purgeService.purgeNonMutualRecognitions(realTwentyFiveHoursLater);

    const found = await recognitionRepo.findById('rec1');
    expect(found).toBeNull();
  });
});
