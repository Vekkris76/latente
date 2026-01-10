import { Revelation } from '../models/Revelation';
import { IRepository } from './IRepository';
export declare class RevelationRepository implements IRepository<Revelation> {
    private revelations;
    save(entity: Revelation): Promise<Revelation>;
    findById(id: string): Promise<Revelation | null>;
    findByUserPairCanonical(userAId: string, userBId: string): Promise<Revelation | null>;
    findActiveByUser(userId: string): Promise<Revelation[]>;
    purgeExpired(now: Date): Promise<string[]>;
    deleteByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=RevelationRepository.d.ts.map