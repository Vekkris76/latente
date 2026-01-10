/**
 * UserRepository - Implementación en memoria para Iteración 1
 */
import { User } from '../models/User';
import { IRepository } from './IRepository';
export declare class UserRepository implements IRepository<User> {
    private users;
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
}
//# sourceMappingURL=UserRepository.d.ts.map