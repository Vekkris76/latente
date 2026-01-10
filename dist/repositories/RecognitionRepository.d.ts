import { Recognition } from '../models/Recognition';
import { IRepository } from './IRepository';
export declare class RecognitionRepository implements IRepository<Recognition> {
    private recognitions;
    save(entity: Recognition): Promise<Recognition>;
    findById(id: string): Promise<Recognition | null>;
    findByWindowAndUser(windowId: string, userId: string): Promise<Recognition | null>;
    findByWindow(windowId: string): Promise<Recognition[]>;
    deleteByWindowId(windowId: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
    purgeExpired(now: Date): Promise<number>;
}
//# sourceMappingURL=RecognitionRepository.d.ts.map