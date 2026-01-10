/**
 * EventRepository - Implementación en memoria para Iteración 1
 */

import { AbstractEvent } from '../types/AbstractEvent.types';
import { IRepository } from './IRepository';

export class EventRepository implements IRepository<AbstractEvent> {
  private events: Map<string, AbstractEvent> = new Map();

  /**
   * Guarda un evento
   * @param event Evento a guardar
   * @returns Evento guardado
   */
  async save(event: AbstractEvent): Promise<AbstractEvent> {
    this.events.set(event.id, event);
    return event;
  }

  /**
   * Busca un evento por ID
   * @param id ID del evento
   * @returns Evento o null si no existe
   */
  async findById(id: string): Promise<AbstractEvent | null> {
    return this.events.get(id) || null;
  }

  /**
   * Busca todos los eventos de un usuario
   * @param userId ID del usuario
   * @returns Lista de eventos
   */
  async findAllByUser(userId: string): Promise<AbstractEvent[]> {
    return Array.from(this.events.values()).filter(
      event => event.user_id === userId
    );
  }
}
