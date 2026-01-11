/**
 * UserRepository - Implementación en memoria para Iteración 1
 */

import { User } from '../../../domain/models/User';
import { IRepository } from '../../../application/ports/IRepository';

export class UserRepository implements IRepository<User> {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<User> {
    this.users.set(user.user_id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.users.delete(userId);
  }
}
