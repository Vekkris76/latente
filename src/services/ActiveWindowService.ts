import { ActiveWindow } from '../models/ActiveWindow';
import { WindowProposal } from '../models/WindowProposal';
import { ActiveWindowRepository } from '../repositories/ActiveWindowRepository';

export class ActiveWindowService {
  constructor(private activeWindowRepo: ActiveWindowRepository) {}

  async activateFromProposal(proposal: WindowProposal, now: Date): Promise<ActiveWindow> {
    // Convert proposed_date (YYYY-MM-DD) and start/end times (HH:MM) to Date objects
    const [year, month, day] = proposal.proposed_date.split('-').map(Number);
    const [startH, startM] = proposal.start_time.split(':').map(Number);
    const [endH, endM] = proposal.end_time.split(':').map(Number);

    const startTime = new Date(Date.UTC(year, month - 1, day, startH, startM));
    const endTime = new Date(Date.UTC(year, month - 1, day, endH, endM));

    const activeWindow: ActiveWindow = {
      id: `aw-${proposal.id}`,
      proposal_id: proposal.id,
      user_a_id: proposal.userA_id,
      user_b_id: proposal.userB_id,
      start_time: startTime,
      end_time: endTime,
      status: 'active',
      created_at: now
    };

    // Marca proposal como consumida
    proposal.status = 'activated';

    return await this.activeWindowRepo.save(activeWindow);
  }

  async getActiveWindowForUser(userId: string, now: Date): Promise<ActiveWindow | null> {
    return await this.activeWindowRepo.findActiveByUser(userId, now);
  }
}
