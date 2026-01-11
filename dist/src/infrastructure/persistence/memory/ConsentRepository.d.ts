/**
 * ConsentRepository - Implementación en memoria para Iteración 1
 */
import { ConsentState } from '../../../domain/models/ConsentState';
import { IRepository } from '../../../domain/repositories/IRepository';
export declare class ConsentRepository implements IRepository<ConsentState> {
    private consents;
    save(consent: ConsentState): Promise<ConsentState>;
    findById(id: string): Promise<ConsentState | null>;
    findByUserId(userId: string): Promise<ConsentState | null>;
}
//# sourceMappingURL=ConsentRepository.d.ts.map