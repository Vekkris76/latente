import { WindowProposalService } from '../../../src/services/WindowProposalService';
import { WindowDecisionService } from '../../../src/services/WindowDecisionService';
import { WindowProposalRepository } from '../../../src/repositories/WindowProposalRepository';
import { CooldownRepository } from '../../../src/repositories/CooldownRepository';
import { ProposalStateRepository } from '../../../src/repositories/ProposalStateRepository';
import { CoPresenceRepository } from '../../../src/repositories/CoPresenceRepository';
import { PatternRepository } from '../../../src/repositories/PatternRepository';
import { LatentCoPresence } from '../../../src/models/LatentCoPresence';
import { LatentCoPresenceStatus, PlaceCategory, TimeBucket, DayType } from '../../../src/types/enums';
import { Pattern } from '../../../src/models/Pattern';

describe('Window Decision Flow Integration', () => {
  let proposalService: WindowProposalService;
  let decisionService: WindowDecisionService;
  let proposalRepo: WindowProposalRepository;
  let cooldownRepo: CooldownRepository;
  let proposalStateRepo: ProposalStateRepository;
  let coPresenceRepo: CoPresenceRepository;
  let patternRepo: PatternRepository;

  const now = new Date('2026-01-10T10:00:00Z');

  beforeEach(() => {
    proposalRepo = new WindowProposalRepository();
    cooldownRepo = new CooldownRepository();
    proposalStateRepo = new ProposalStateRepository();
    coPresenceRepo = new CoPresenceRepository();
    patternRepo = new PatternRepository();
    
    proposalService = new WindowProposalService(
      proposalRepo,
      cooldownRepo,
      proposalStateRepo,
      coPresenceRepo,
      patternRepo
    );

    decisionService = new WindowDecisionService(
      proposalRepo,
      cooldownRepo,
      proposalStateRepo,
      coPresenceRepo
    );
  });

  it('should complete the flow from co-presence to activated proposal', async () => {
    // 1. Setup patterns and co-presence
    const patternA: Pattern = {
      pattern_id: 'pA',
      user_id: 'userA',
      place_category: PlaceCategory.CAFE,
      time_bucket: TimeBucket.MORNING,
      day_type: DayType.WEEKDAY,
      occurrences_count: 3,
      first_week_id: '2026-W01',
      last_week_id: '2026-W01',
      pattern_status: 'active' as any,
      detected_at: now
    };
    await patternRepo.save(patternA);

    const coPresence: LatentCoPresence = {
      copresence_id: 'cp_1',
      user_a_id: 'userA',
      user_b_id: 'userB',
      shared_place_category: PlaceCategory.CAFE,
      shared_time_bucket: TimeBucket.MORNING,
      pattern_id_a: 'pA',
      pattern_id_b: 'pB',
      overlap_week_ids: ['2026-W01'],
      status: LatentCoPresenceStatus.DETECTED,
      detected_at: now
    };
    await coPresenceRepo.save(coPresence);

    // 2. Generate proposal
    const proposals = await proposalService.generateFromCoPresences(now);
    expect(proposals.length).toBe(1);
    const proposalId = proposals[0].id;

    expect(await proposalStateRepo.hasActiveProposal('userA')).toBe(true);
    expect(await proposalStateRepo.hasActiveProposal('userB')).toBe(true);

    // 3. Accept by A
    await decisionService.accept(proposalId, 'userA', now);
    let updatedProp = await proposalRepo.findById(proposalId);
    expect(updatedProp?.status).toBe('accepted_by_a');

    // 4. Accept by B
    await decisionService.accept(proposalId, 'userB', now);
    updatedProp = await proposalRepo.findById(proposalId);
    expect(updatedProp?.status).toBe('activated');

    // 5. Verify state released
    expect(await proposalStateRepo.hasActiveProposal('userA')).toBe(false);
    expect(await proposalStateRepo.hasActiveProposal('userB')).toBe(false);
  });
});
