import { WindowDecisionService } from '../../../src/services/WindowDecisionService';
import { WindowProposalRepository } from '../../../src/repositories/WindowProposalRepository';
import { CooldownRepository } from '../../../src/repositories/CooldownRepository';
import { ProposalStateRepository } from '../../../src/repositories/ProposalStateRepository';
import { CoPresenceRepository } from '../../../src/repositories/CoPresenceRepository';
import { WindowProposal } from '../../../src/models/WindowProposal';
import { LatentCoPresence } from '../../../src/models/LatentCoPresence';
import { LatentCoPresenceStatus, PlaceCategory, TimeBucket, DayType } from '../../../src/types/enums';
import { PROPOSAL_TTL_HOURS } from '../../../src/config/decisions';

describe('WindowDecisionService', () => {
  let service: WindowDecisionService;
  let proposalRepo: WindowProposalRepository;
  let cooldownRepo: CooldownRepository;
  let proposalStateRepo: ProposalStateRepository;
  let coPresenceRepo: CoPresenceRepository;

  const now = new Date('2026-01-10T10:00:00Z');

  beforeEach(() => {
    proposalRepo = new WindowProposalRepository();
    cooldownRepo = new CooldownRepository();
    proposalStateRepo = new ProposalStateRepository();
    coPresenceRepo = new CoPresenceRepository();
    service = new WindowDecisionService(proposalRepo, cooldownRepo, proposalStateRepo, coPresenceRepo);
  });

  const createMockProposal = (id: string, userA: string, userB: string): WindowProposal => ({
    id,
    userA_id: userA,
    userB_id: userB,
    place_category: PlaceCategory.CAFE,
    time_bucket: TimeBucket.MORNING,
    day_type: DayType.WEEKDAY,
    proposed_date: '2026-01-11',
    start_time: '09:00',
    end_time: '09:30',
    status: 'pending',
    acceptA: false,
    acceptB: false,
    declined_by: null,
    created_at: now,
    coPresenceId: 'cp_1'
  });

  const createMockCoPresence = (id: string, userA: string, userB: string): LatentCoPresence => ({
    copresence_id: id,
    user_a_id: userA,
    user_b_id: userB,
    shared_place_category: PlaceCategory.CAFE,
    shared_time_bucket: TimeBucket.MORNING,
    pattern_id_a: 'pA',
    pattern_id_b: 'pB',
    overlap_week_ids: ['2026-W01'],
    status: LatentCoPresenceStatus.PROPOSED,
    detected_at: now
  });

  describe('accept', () => {
    it('should mark as accepted_by_a when user A accepts', async () => {
      const proposal = createMockProposal('prop1', 'userA', 'userB');
      await proposalRepo.save(proposal);

      const result = await service.accept('prop1', 'userA', now);

      expect(result.status).toBe('accepted_by_a');
      expect(result.acceptA).toBe(true);
      expect(result.acceptB).toBe(false);
    });

    it('should mark as activated when both accept', async () => {
      const proposal = createMockProposal('prop1', 'userA', 'userB');
      await proposalRepo.save(proposal);
      await proposalStateRepo.setActiveProposal('userA', true);
      await proposalStateRepo.setActiveProposal('userB', true);

      await service.accept('prop1', 'userA', now);
      const result = await service.accept('prop1', 'userB', now);

      expect(result.status).toBe('activated');
      expect(result.acceptA).toBe(true);
      expect(result.acceptB).toBe(true);
      
      // Should release proposal state
      expect(await proposalStateRepo.hasActiveProposal('userA')).toBe(false);
      expect(await proposalStateRepo.hasActiveProposal('userB')).toBe(false);
    });

    it('should throw error if proposal not found', async () => {
      await expect(service.accept('nonexistent', 'userA', now)).rejects.toThrow('Proposal not found');
    });

    it('should throw error if proposal is already declined', async () => {
      const proposal = createMockProposal('prop1', 'userA', 'userB');
      proposal.status = 'declined';
      await proposalRepo.save(proposal);

      await expect(service.accept('prop1', 'userA', now)).rejects.toThrow('cannot be accepted');
    });

    it('should handle one accepting and then the other declining', async () => {
      const proposal = createMockProposal('prop1', 'userA', 'userB');
      await proposalRepo.save(proposal);
      await proposalStateRepo.setActiveProposal('userA', true);
      await proposalStateRepo.setActiveProposal('userB', true);

      // A accepts
      await service.accept('prop1', 'userA', now);
      
      // B declines
      const result = await service.decline('prop1', 'userB', now);

      expect(result.status).toBe('declined');
      expect(result.declined_by).toBe('userB');
      
      // Cooldown only for B
      expect(await cooldownRepo.isInCooldown('userB', now)).toBe(true);
      expect(await cooldownRepo.isInCooldown('userA', now)).toBe(false);

      // ProposalState released for both
      expect(await proposalStateRepo.hasActiveProposal('userA')).toBe(false);
      expect(await proposalStateRepo.hasActiveProposal('userB')).toBe(false);
    });
  });

  describe('decline', () => {
    it('should mark as declined and apply cooldown to decliner', async () => {
      const proposal = createMockProposal('prop1', 'userA', 'userB');
      await proposalRepo.save(proposal);
      
      const cp = createMockCoPresence('cp_1', 'userA', 'userB');
      await coPresenceRepo.save(cp);

      await proposalStateRepo.setActiveProposal('userA', true);
      await proposalStateRepo.setActiveProposal('userB', true);

      const result = await service.decline('prop1', 'userA', now);

      expect(result.status).toBe('declined');
      expect(result.declined_by).toBe('userA');
      
      // Cooldown for userA
      expect(await cooldownRepo.isInCooldown('userA', now)).toBe(true);
      // No cooldown for userB
      expect(await cooldownRepo.isInCooldown('userB', now)).toBe(false);

      // Co-presence should be expired (inactive)
      const updatedCp = await coPresenceRepo.findById('cp_1');
      expect(updatedCp?.status).toBe(LatentCoPresenceStatus.EXPIRED);

      // Should release proposal state
      expect(await proposalStateRepo.hasActiveProposal('userA')).toBe(false);
      expect(await proposalStateRepo.hasActiveProposal('userB')).toBe(false);
    });
  });

  describe('expireProposals', () => {
    it('should expire proposals past their expires_at (48h)', async () => {
      const proposal = createMockProposal('prop1', 'userA', 'userB');
      // created_at = now - 49h => expired
      proposal.created_at = new Date(now.getTime() - 49 * 60 * 60 * 1000);
      proposal.expires_at = new Date(proposal.created_at.getTime() + PROPOSAL_TTL_HOURS * 60 * 60 * 1000);
      await proposalRepo.save(proposal);

      const cp = createMockCoPresence('cp_1', 'userA', 'userB');
      await coPresenceRepo.save(cp);

      await proposalStateRepo.setActiveProposal('userA', true);
      await proposalStateRepo.setActiveProposal('userB', true);

      const expiredCount = await service.expireProposals(now);

      expect(expiredCount).toBe(1);
      const updatedProp = await proposalRepo.findById('prop1');
      expect(updatedProp?.status).toBe('expired');
      
      const updatedCp = await coPresenceRepo.findById('cp_1');
      expect(updatedCp?.status).toBe(LatentCoPresenceStatus.EXPIRED);
      
      // No cooldown on expiration
      expect(await cooldownRepo.isInCooldown('userA', now)).toBe(false);
      expect(await cooldownRepo.isInCooldown('userB', now)).toBe(false);

      // ProposalState released
      expect(await proposalStateRepo.hasActiveProposal('userA')).toBe(false);
      expect(await proposalStateRepo.hasActiveProposal('userB')).toBe(false);
    });

    it('should NOT expire proposals if not yet 48h', async () => {
      const proposal = createMockProposal('prop1', 'userA', 'userB');
      // created_at = now - 47h => NOT expired
      proposal.created_at = new Date(now.getTime() - 47 * 60 * 60 * 1000);
      proposal.expires_at = new Date(proposal.created_at.getTime() + PROPOSAL_TTL_HOURS * 60 * 60 * 1000);
      await proposalRepo.save(proposal);

      const expiredCount = await service.expireProposals(now);

      expect(expiredCount).toBe(0);
      const updatedProp = await proposalRepo.findById('prop1');
      expect(updatedProp?.status).toBe('pending');
    });
  });
});
