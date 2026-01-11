import { ActiveWindowService } from '../../../src/application/services/ActiveWindowService';
import { ActiveWindowRepository } from '../../../src/infrastructure/persistence/memory/ActiveWindowRepository';
import { WindowProposal } from '../../../src/domain/models/WindowProposal';
import { PlaceCategory, TimeBucket, DayType } from '../../../src/domain/types/enums';

describe('ActiveWindowService', () => {
  let service: ActiveWindowService;
  let activeWindowRepo: ActiveWindowRepository;

  beforeEach(() => {
    activeWindowRepo = new ActiveWindowRepository();
    service = new ActiveWindowService(activeWindowRepo);
  });

  it('should create active window from proposal', async () => {
    const now = new Date('2026-01-10T10:00:00Z');
    const proposal: WindowProposal = {
      id: 'win1',
      userA_id: 'userA',
      userB_id: 'userB',
      place_category: PlaceCategory.CAFE,
      time_bucket: TimeBucket.MORNING,
      day_type: DayType.WEEKDAY,
      proposed_date: '2026-01-12',
      start_time: '09:00',
      end_time: '09:45',
      status: 'pending',
      acceptA: true,
      acceptB: true,
      declined_by: null,
      created_at: now
    };

    const activeWindow = await service.activateFromProposal(proposal, now);

    expect(activeWindow.proposal_id).toBe('win1');
    expect(activeWindow.status).toBe('active');
    expect(activeWindow.start_time.toISOString()).toContain('2026-01-12T09:00:00');
    expect(activeWindow.end_time.toISOString()).toContain('2026-01-12T09:45:00');
    expect(proposal.status).toBe('activated');
  });

  it('should return active window for user only within time range', async () => {
    const now = new Date('2026-01-12T09:15:00Z');
    const proposal: WindowProposal = {
      id: 'win1',
      userA_id: 'userA',
      userB_id: 'userB',
      place_category: PlaceCategory.CAFE,
      time_bucket: TimeBucket.MORNING,
      day_type: DayType.WEEKDAY,
      proposed_date: '2026-01-12',
      start_time: '09:00',
      end_time: '09:45',
      status: 'pending',
      acceptA: true,
      acceptB: true,
      declined_by: null,
      created_at: now
    };

    await service.activateFromProposal(proposal, now);

    const active = await service.getActiveWindowForUser('userA', now);
    expect(active).not.toBeNull();
    expect(active?.proposal_id).toBe('win1');

    const tooEarly = new Date('2026-01-12T08:59:00Z');
    expect(await service.getActiveWindowForUser('userA', tooEarly)).toBeNull();

    const tooLate = new Date('2026-01-12T09:46:00Z');
    expect(await service.getActiveWindowForUser('userA', tooLate)).toBeNull();
  });
});
