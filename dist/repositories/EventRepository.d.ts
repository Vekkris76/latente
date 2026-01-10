/**
 * EventRepository - Implementación en memoria para Iteración 1
 */
import { AbstractEvent } from '../types/AbstractEvent.types';
import { IRepository } from './IRepository';
export declare class EventRepository implements IRepository<AbstractEvent> {
    private events;
    /**
     * Guarda un evento
     * @param event Evento a guardar
     * @returns Evento guardado
     */
    save(event: AbstractEvent): Promise<AbstractEvent>;
    /**
     * Busca un evento por ID
     * @param id ID del evento
     * @returns Evento o null si no existe
     */
    findById(id: string): Promise<AbstractEvent | null>;
    /**
     * Busca todos los eventos de un usuario
     * @param userId ID del usuario
     * @returns Lista de eventos
     */
    findAllByUser(userId: string): Promise<AbstractEvent[]>;
}
//# sourceMappingURL=EventRepository.d.ts.map