"use strict";
/**
 * EventRepository - Implementación en memoria para Iteración 1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRepository = void 0;
class EventRepository {
    constructor() {
        this.events = new Map();
    }
    /**
     * Guarda un evento
     * @param event Evento a guardar
     * @returns Evento guardado
     */
    async save(event) {
        this.events.set(event.id, event);
        return event;
    }
    /**
     * Busca un evento por ID
     * @param id ID del evento
     * @returns Evento o null si no existe
     */
    async findById(id) {
        return this.events.get(id) || null;
    }
    /**
     * Busca todos los eventos de un usuario
     * @param userId ID del usuario
     * @returns Lista de eventos
     */
    async findAllByUser(userId) {
        return Array.from(this.events.values()).filter(event => event.user_id === userId);
    }
    async deleteByUserId(userId) {
        for (const [id, event] of this.events.entries()) {
            if (event.user_id === userId) {
                this.events.delete(id);
            }
        }
    }
}
exports.EventRepository = EventRepository;
//# sourceMappingURL=EventRepository.js.map