import { AccountDeletionService } from '../../../src/services/AccountDeletionService';
import { EventRepository } from '../../../src/repositories/EventRepository';
import { PatternRepository } from '../../../src/repositories/PatternRepository';
import { CoPresenceRepository } from '../../../src/repositories/CoPresenceRepository';
import { WindowProposalRepository } from '../../../src/repositories/WindowProposalRepository';
import { ActiveWindowRepository } from '../../../src/repositories/ActiveWindowRepository';
import { RecognitionRepository } from '../../../src/repositories/RecognitionRepository';
import { RevelationRepository } from '../../../src/repositories/RevelationRepository';
import { ConversationRepository } from '../../../src/repositories/ConversationRepository';
import { CooldownRepository } from '../../../src/repositories/CooldownRepository';
import { ProposalStateRepository } from '../../../src/repositories/ProposalStateRepository';
import { UserRepository } from '../../../src/repositories/UserRepository';
import { BlockRepository } from '../../../src/repositories/BlockRepository';

import { User } from '../../../src/models/User';
import { AccountStatus, LatentCoPresenceStatus } from '../../../src/types/enums';

describe('AccountDeletionService', () => {
  let service: AccountDeletionService;
  let eventRepo: EventRepository;
  let patternRepo: PatternRepository;
  let coPresenceRepo: CoPresenceRepository;
  let proposalRepo: WindowProposalRepository;
  let activeWindowRepo: ActiveWindowRepository;
  let recognitionRepo: RecognitionRepository;
  let revelationRepo: RevelationRepository;
  let conversationRepo: ConversationRepository;
  let cooldownRepo: CooldownRepository;
  let proposalStateRepo: ProposalStateRepository;
  let userRepo: UserRepository;
  let blockRepo: BlockRepository;

  beforeEach(() => {
    eventRepo = new EventRepository();
    patternRepo = new PatternRepository();
    coPresenceRepo = new CoPresenceRepository();
    proposalRepo = new WindowProposalRepository();
    activeWindowRepo = new ActiveWindowRepository();
    recognitionRepo = new RecognitionRepository();
    revelationRepo = new RevelationRepository();
    conversationRepo = new ConversationRepository();
    cooldownRepo = new CooldownRepository();
    proposalStateRepo = new ProposalStateRepository();
    userRepo = new UserRepository();
    blockRepo = new BlockRepository();

    service = new AccountDeletionService(
      eventRepo, patternRepo, coPresenceRepo, proposalRepo,
      activeWindowRepo, recognitionRepo, revelationRepo,
      conversationRepo, cooldownRepo, proposalStateRepo, userRepo
    );
  });

  it('1) deleteAccount purga todo lo “vivo” del usuario', async () => {
    const userId = 'userA';
    const otherId = 'userB';
    const now = new Date();

    // Seed everything
    await userRepo.save({ user_id: userId, name: 'A', age: 25, account_status: AccountStatus.ACTIVE, observation_active: true, created_at: now });
    await eventRepo.save({ id: 'e1', user_id: userId, place_category: 'cafe', time_bucket: 'morning', day_type: 'weekday', duration_bucket: 'medium', week_id: 'w1', created_at: now, status: 'processed' });
    await patternRepo.save({ pattern_id: 'p1', user_id: userId, place_category: 'cafe', time_bucket: 'morning', day_type: 'weekday', occurrences_count: 3, first_week_id: 'w1', last_week_id: 'w1', pattern_status: 'active' as any, detected_at: now });
    await coPresenceRepo.save({ copresence_id: 'cp1', user_a_id: userId, user_b_id: otherId, pattern_id_a: 'p1', pattern_id_b: 'p2', shared_place_category: 'cafe', shared_time_bucket: 'morning', overlap_week_ids: ['w1'], detected_at: now, status: LatentCoPresenceStatus.DETECTED });
    await proposalRepo.save({ id: 'prop1', userA_id: userId, userB_id: otherId, place_category: 'cafe' as any, time_bucket: 'morning' as any, day_type: 'weekday' as any, proposed_date: '2026-01-12', start_time: '09:00', end_time: '09:30', status: 'pending', acceptA: false, acceptB: false, declined_by: null, created_at: now });
    await activeWindowRepo.save({ id: 'aw1', proposal_id: 'prop1', user_a_id: userId, user_b_id: otherId, start_time: now, end_time: now, status: 'active', created_at: now });
    await recognitionRepo.save({ id: 'rec1', active_window_id: 'aw1', user_id: userId, created_at: now, status: 'confirmed' });
    await revelationRepo.save({ id: 'rev1', user_a_id: userId, user_b_id: otherId, pattern_summary: 'test', revealed_at: now, expires_at: now, status: 'active' });
    await conversationRepo.save({ id: 'm1', revelation_id: 'rev1', sender_user_id: userId, text: 'hi', created_at: now });
    await cooldownRepo.setCooldownUntil(userId, now);
    await proposalStateRepo.setActiveProposal(userId, true);

    // Action
    await service.deleteAccount(userId, now);

    // Verifications
    expect(await userRepo.findById(userId)).toBeNull();
    expect(await eventRepo.findAllByUser(userId)).toHaveLength(0);
    expect(await patternRepo.findAllByUser(userId)).toHaveLength(0);
    expect(await coPresenceRepo.findAll()).toHaveLength(0);
    expect(await proposalRepo.findAll()).toHaveLength(0);
    expect(await activeWindowRepo.findAll()).toHaveLength(0);
    expect(await recognitionRepo.findById('rec1')).toBeNull();
    expect(await revelationRepo.findById('rev1')).toBeNull();
    expect(await conversationRepo.findByRevelationId('rev1')).toHaveLength(0);
    expect(await cooldownRepo.getCooldownUntil(userId)).toBeNull();
    expect(await proposalStateRepo.hasActiveProposal(userId)).toBe(false);
  });

  it('2) Se conservan bloqueos emitidos por el usuario', async () => {
    const userId = 'userA';
    const otherId = 'userB';
    const now = new Date();

    await blockRepo.save({ id: 'blk1', blocker_user_id: userId, blocked_user_id: otherId, created_at: now });

    await service.deleteAccount(userId, now);

    expect(await blockRepo.existsBlock(userId, otherId)).toBe(true);
  });

  it('3) Bloqueos hacia el usuario se conservan', async () => {
    const userId = 'userA';
    const otherId = 'userB';
    const now = new Date();

    await blockRepo.save({ id: 'blk2', blocker_user_id: otherId, blocked_user_id: userId, created_at: now });

    await service.deleteAccount(userId, now);

    expect(await blockRepo.existsBlock(otherId, userId)).toBe(true);
  });
});
