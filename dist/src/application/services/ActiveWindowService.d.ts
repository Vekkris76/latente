import { ActiveWindow } from '../../domain/models/ActiveWindow';
import { WindowProposal } from '../../domain/models/WindowProposal';
import { ActiveWindowRepository } from '../../infrastructure/persistence/memory/ActiveWindowRepository';
export declare class ActiveWindowService {
    private activeWindowRepo;
    constructor(activeWindowRepo: ActiveWindowRepository);
    activateFromProposal(proposal: WindowProposal, now: Date): Promise<ActiveWindow>;
    getActiveWindowForUser(userId: string, now: Date): Promise<ActiveWindow | null>;
}
//# sourceMappingURL=ActiveWindowService.d.ts.map