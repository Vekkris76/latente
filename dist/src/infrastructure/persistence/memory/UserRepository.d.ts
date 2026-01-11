/**
 * UserRepository - Implementación en memoria para Iteración 1
 */
import { User } from '../../../domain/models/User';
import { IRepository } from '../../../domain/repositories/IRepository';
export declare class UserRepository implements IRepository<User> {
    private users;
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    deleteByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=UserRepository.d.ts.map