import { WindowProposal } from '../../../domain/models/WindowProposal';
import { IRepository } from '../../../domain/repositories/IRepository';
export declare class WindowProposalRepository implements IRepository<WindowProposal> {
    private proposals;
    save(proposal: WindowProposal): Promise<WindowProposal>;
    findById(id: string): Promise<WindowProposal | null>;
    findActiveByUser(userId: string): Promise<WindowProposal | null>;
    findActiveBetweenPair(userAId: string, userBId: string): Promise<WindowProposal | null>;
    findPendingExpirable(now: Date): Promise<WindowProposal[]>;
    existsActiveBetweenPair(userAId: string, userBId: string): Promise<boolean>;
    listByUser(userId: string): Promise<WindowProposal[]>;
    findAll(): Promise<WindowProposal[]>;
    delete(id: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=WindowProposalRepository.d.ts.map