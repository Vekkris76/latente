import { LatentCoPresence } from '../models/LatentCoPresence';
import { IRepository } from './IRepository';
export declare class CoPresenceRepository implements IRepository<LatentCoPresence> {
    private copresences;
    save(copresence: LatentCoPresence): Promise<LatentCoPresence>;
    findById(id: string): Promise<LatentCoPresence | null>;
    findActiveByUser(userId: string): Promise<LatentCoPresence[]>;
    existsActiveBetween(userA: string, userB: string, category: string, bucket: string): Promise<boolean>;
    findByPairAndPattern(userA: string, userB: string, category: string, bucket: string): Promise<LatentCoPresence | null>;
    markInactive(id: string): Promise<void>;
    findAll(): Promise<LatentCoPresence[]>;
    deleteByUserId(userId: string): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=CoPresenceRepository.d.ts.map