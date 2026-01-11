import { Pattern } from '../../../domain/models/Pattern';
import { IRepository } from '../../../domain/repositories/IRepository';
export declare class PatternRepository implements IRepository<Pattern> {
    private patterns;
    save(pattern: Pattern): Promise<Pattern>;
    findById(id: string): Promise<Pattern | null>;
    findAllByUser(userId: string): Promise<Pattern[]>;
    deleteByUserId(userId: string): Promise<void>;
    upsertByKey(pattern: Pattern): Promise<Pattern>;
    clear(): Promise<void>;
}
//# sourceMappingURL=PatternRepository.d.ts.map