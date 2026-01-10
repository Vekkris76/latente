/**
 * ConsentRepository - Implementación en memoria para Iteración 1
 */
import { ConsentState } from '../models/ConsentState';
import { IRepository } from './IRepository';
export declare class ConsentRepository implements IRepository<ConsentState> {
    private consents;
    save(consent: ConsentState): Promise<ConsentState>;
    findById(id: string): Promise<ConsentState | null>;
    findByUserId(userId: string): Promise<ConsentState | null>;
}
//# sourceMappingURL=ConsentRepository.d.ts.map