import { ActiveWindow } from '../models/ActiveWindow';
import { IRepository } from './IRepository';
export declare class ActiveWindowRepository implements IRepository<ActiveWindow> {
    private windows;
    save(entity: ActiveWindow): Promise<ActiveWindow>;
    findById(id: string): Promise<ActiveWindow | null>;
    findActiveByUser(userId: string, now: Date): Promise<ActiveWindow | null>;
    delete(id: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    findAll(): Promise<ActiveWindow[]>;
}
//# sourceMappingURL=ActiveWindowRepository.d.ts.map