/**
 * ConsentRepository - Implementación en memoria para Iteración 1
 */

import { ConsentState } from '../../../domain/models/ConsentState';
import { IRepository } from '../../../application/ports/IRepository';

export class ConsentRepository implements IRepository<ConsentState> {
  private consents: Map<string, ConsentState> = new Map();

  async save(consent: ConsentState): Promise<ConsentState> {
    this.consents.set(consent.user_id, consent);
    return consent;
  }

  async findById(id: string): Promise<ConsentState | null> {
    return this.consents.get(id) || null;
  }

  async findByUserId(userId: string): Promise<ConsentState | null> {
    return this.consents.get(userId) || null;
  }
}
