import { WindowProposal } from '../models/WindowProposal';
import { WindowProposalRepository } from '../repositories/WindowProposalRepository';
import { CooldownRepository } from '../repositories/CooldownRepository';
import { ProposalStateRepository } from '../repositories/ProposalStateRepository';
import { CoPresenceRepository } from '../repositories/CoPresenceRepository';
import { DECLINE_COOLDOWN_DAYS, PROPOSAL_TTL_HOURS } from '../config/decisions';
import { addDays } from '../utils/dateUtils';

export class WindowDecisionService {
  constructor(
    private proposalRepo: WindowProposalRepository,
    private cooldownRepo: CooldownRepository,
    private proposalStateRepo: ProposalStateRepository,
    private coPresenceRepo: CoPresenceRepository
  ) {}

  async accept(proposalId: string, userId: string, now: Date): Promise<WindowProposal> {
    const proposal = await this.proposalRepo.findById(proposalId);
    if (!proposal) throw new Error('Proposal not found');

    const validStatuses = ['pending', 'accepted_by_a', 'accepted_by_b'];
    if (!validStatuses.includes(proposal.status)) {
      throw new Error(`Proposal is in status ${proposal.status} and cannot be accepted`);
    }

    if (proposal.expires_at && now > proposal.expires_at) {
      // Técnicamente debería haber sido expirada por el cron, pero validamos aquí también
      throw new Error('Proposal has expired');
    }

    if (userId === proposal.userA_id) {
      proposal.acceptA = true;
    } else if (userId === proposal.userB_id) {
      proposal.acceptB = true;
    } else {
      throw new Error('User is not part of this proposal');
    }

    if (proposal.acceptA && proposal.acceptB) {
      proposal.status = 'activated';
      // Al activar, liberar ProposalStateRepository para ambos usuarios
      await this.proposalStateRepo.setActiveProposal(proposal.userA_id, false);
      await this.proposalStateRepo.setActiveProposal(proposal.userB_id, false);
    } else if (proposal.acceptA) {
      proposal.status = 'accepted_by_a';
    } else if (proposal.acceptB) {
      proposal.status = 'accepted_by_b';
    }

    await this.proposalRepo.save(proposal);
    return proposal;
  }

  async decline(proposalId: string, userId: string, now: Date): Promise<WindowProposal> {
    const proposal = await this.proposalRepo.findById(proposalId);
    if (!proposal) throw new Error('Proposal not found');

    if (proposal.status === 'declined' || proposal.status === 'expired' || proposal.status === 'activated') {
      throw new Error(`Proposal is already in a final state: ${proposal.status}`);
    }

    proposal.status = 'declined';
    proposal.declined_by = userId;

    // Aplicar cooldown 7 días al declinante
    const cooldownUntil = addDays(now, DECLINE_COOLDOWN_DAYS);
    await this.cooldownRepo.setCooldownUntil(userId, cooldownUntil);

    // Purgar copresencia latente relacionada
    await this.purgeRelatedCoPresence(proposal);

    // Liberar ProposalStateRepository para ambos usuarios
    await this.proposalStateRepo.setActiveProposal(proposal.userA_id, false);
    await this.proposalStateRepo.setActiveProposal(proposal.userB_id, false);

    await this.proposalRepo.save(proposal);
    return proposal;
  }

  async expireProposals(now: Date): Promise<number> {
    const expirable = await this.proposalRepo.findPendingExpirable(now);
    let count = 0;

    for (const proposal of expirable) {
      proposal.status = 'expired';

      // Purgar copresencia latente
      await this.purgeRelatedCoPresence(proposal);

      // Liberar ProposalStateRepository
      await this.proposalStateRepo.setActiveProposal(proposal.userA_id, false);
      await this.proposalStateRepo.setActiveProposal(proposal.userB_id, false);

      await this.proposalRepo.save(proposal);
      count++;
    }

    return count;
  }

  private async purgeRelatedCoPresence(proposal: WindowProposal): Promise<void> {
    if (proposal.coPresenceId) {
      await this.coPresenceRepo.markInactive(proposal.coPresenceId);
    } else {
      // Localizar por pareja canónica + (place_category, time_bucket)
      const cp = await this.coPresenceRepo.findByPairAndPattern(
        proposal.userA_id,
        proposal.userB_id,
        proposal.place_category,
        proposal.time_bucket
      );
      if (cp) {
        await this.coPresenceRepo.markInactive(cp.copresence_id);
      }
    }
  }
}
