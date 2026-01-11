import { WindowProposalService } from '../../../src/application/services/WindowProposalService';
import { WindowProposalRepository } from '../../../src/infrastructure/persistence/memory/WindowProposalRepository';
import { CooldownRepository } from '../../../src/infrastructure/persistence/memory/CooldownRepository';
import { ProposalStateRepository } from '../../../src/infrastructure/persistence/memory/ProposalStateRepository';
import { CoPresenceRepository } from '../../../src/infrastructure/persistence/memory/CoPresenceRepository';
import { PatternRepository } from '../../../src/infrastructure/persistence/memory/PatternRepository';
import { LatentCoPresenceStatus, TimeBucket, PlaceCategory, DayType, PatternStatus } from '../../../src/domain/types/enums';
import { LatentCoPresence } from '../../../src/domain/models/LatentCoPresence';
import { Pattern } from '../../../src/domain/models/Pattern';

describe('WindowProposalService', () => {
  let service: WindowProposalService;
  let proposalRepo: WindowProposalRepository;
  let cooldownRepo: CooldownRepository;
  let proposalStateRepo: ProposalStateRepository;
  let coPresenceRepo: CoPresenceRepository;
  let patternRepo: PatternRepository;

  beforeEach(() => {
    proposalRepo = new WindowProposalRepository();
    cooldownRepo = new CooldownRepository();
    proposalStateRepo = new ProposalStateRepository();
    coPresenceRepo = new CoPresenceRepository();
    patternRepo = new PatternRepository();
    service = new WindowProposalService(
      proposalRepo,
      cooldownRepo,
      proposalStateRepo,
      coPresenceRepo,
      patternRepo
    );
  });

  it('should generate a proposal from a detected co-presence (Happy Path)', async () => {
    const now = new Date('2026-01-10T10:00:00Z'); // Sábado
    
    const pattern: Pattern = {
      pattern_id: 'pat1',
      user_id: 'userA',
      place_category: PlaceCategory.CAFE,
      time_bucket: TimeBucket.MORNING,
      day_type: DayType.WEEKDAY,
      occurrences_count: 3,
      first_week_id: '2026-01',
      last_week_id: '2026-02',
      pattern_status: PatternStatus.ACTIVE,
      detected_at: now
    };
    await patternRepo.save(pattern);

    const coPresence: LatentCoPresence = {
      copresence_id: 'cop1',
      user_a_id: 'userA',
      user_b_id: 'userB',
      pattern_id_a: 'pat1',
      pattern_id_b: 'pat2',
      shared_place_category: PlaceCategory.CAFE,
      shared_time_bucket: TimeBucket.MORNING,
      overlap_week_ids: ['2026-01'],
      detected_at: now,
      status: LatentCoPresenceStatus.DETECTED
    };
    await coPresenceRepo.save(coPresence);

    const proposals = await service.generateFromCoPresences(now);

    expect(proposals).toHaveLength(1);
    expect(proposals[0].userA_id).toBe('userA');
    expect(proposals[0].userB_id).toBe('userB');
    expect(proposals[0].status).toBe('pending');
    expect(proposals[0].start_time).toBe('09:00');
    expect(proposals[0].end_time).toBe('09:30'); // 30 min duration
    // El lunes 12 es el primer weekday tras el sábado 10
    expect(proposals[0].proposed_date).toBe('2026-01-12'); 
    
    expect(await proposalStateRepo.hasActiveProposal('userA')).toBe(true);
    expect(await proposalStateRepo.hasActiveProposal('userB')).toBe(true);
    expect(coPresence.status).toBe(LatentCoPresenceStatus.PROPOSED);
  });

  it('should not generate proposal if time_bucket is midday or night (TODO)', async () => {
    const now = new Date('2026-01-10T10:00:00Z');
    
    const coPresenceMidday: LatentCoPresence = {
      copresence_id: 'cop_midday',
      user_a_id: 'userA',
      user_b_id: 'userB',
      pattern_id_a: 'pat1',
      pattern_id_b: 'pat2',
      shared_place_category: PlaceCategory.CAFE,
      shared_time_bucket: TimeBucket.MIDDAY,
      overlap_week_ids: ['2026-01'],
      detected_at: now,
      status: LatentCoPresenceStatus.DETECTED
    };
    await coPresenceRepo.save(coPresenceMidday);

    const proposals = await service.generateFromCoPresences(now);
    expect(proposals).toHaveLength(0);
  });

  it('should not generate proposal if user has active proposal', async () => {
    const now = new Date('2026-01-10T10:00:00Z');
    await proposalStateRepo.setActiveProposal('userA', true);

    const coPresence: LatentCoPresence = {
      copresence_id: 'cop1',
      user_a_id: 'userA',
      user_b_id: 'userB',
      pattern_id_a: 'pat1',
      pattern_id_b: 'pat2',
      shared_place_category: PlaceCategory.CAFE,
      shared_time_bucket: TimeBucket.MORNING,
      overlap_week_ids: ['2026-01'],
      detected_at: now,
      status: LatentCoPresenceStatus.DETECTED
    };
    await coPresenceRepo.save(coPresence);

    const proposals = await service.generateFromCoPresences(now);
    expect(proposals).toHaveLength(0);
  });

  it('should not generate proposal if user is in cooldown', async () => {
    const now = new Date('2026-01-10T10:00:00Z');
    await cooldownRepo.setCooldownUntil('userB', new Date('2026-01-15T00:00:00Z'));

    const coPresence: LatentCoPresence = {
      copresence_id: 'cop1',
      user_a_id: 'userA',
      user_b_id: 'userB',
      pattern_id_a: 'pat1',
      pattern_id_b: 'pat2',
      shared_place_category: PlaceCategory.CAFE,
      shared_time_bucket: TimeBucket.MORNING,
      overlap_week_ids: ['2026-01'],
      detected_at: now,
      status: LatentCoPresenceStatus.DETECTED
    };
    await coPresenceRepo.save(coPresence);

    const proposals = await service.generateFromCoPresences(now);
    expect(proposals).toHaveLength(0);
  });

  it('should clamp time to allowed range 08:00-22:00', () => {
    const { clampTime } = require('../../../src/infrastructure/utils/dateUtils');
    expect(clampTime('07:00')).toBe('08:00');
    expect(clampTime('23:00')).toBe('22:00');
    expect(clampTime('12:00')).toBe('12:00');
  });
});
