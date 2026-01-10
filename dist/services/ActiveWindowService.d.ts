import { ActiveWindow } from '../models/ActiveWindow';
import { WindowProposal } from '../models/WindowProposal';
import { ActiveWindowRepository } from '../repositories/ActiveWindowRepository';
export declare class ActiveWindowService {
    private activeWindowRepo;
    constructor(activeWindowRepo: ActiveWindowRepository);
    activateFromProposal(proposal: WindowProposal, now: Date): Promise<ActiveWindow>;
    getActiveWindowForUser(userId: string, now: Date): Promise<ActiveWindow | null>;
}
//# sourceMappingURL=ActiveWindowService.d.ts.map