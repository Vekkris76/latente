"use strict";
/**
 * EventIngestionService - Servicio de ingesta de eventos abstractos
 *
 * Responsabilidades según MVP_TECNICO_MINIMO.md sección 4.2:
 * - Recibe eventos abstractos
 * - Valida campos permitidos (delega a AbstractEventValidator)
 * - Almacena en EventRepository
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventIngestionService = void 0;
class EventIngestionService {
    constructor(eventRepository, validator) {
        this.eventRepository = eventRepository;
        this.validator = validator;
    }
    /**
     * Ingesta un evento abstracto
     *
     * Proceso:
     * 1. Validar input usando AbstractEventValidator
     * 2. Crear AbstractEvent con campos internos (id, user_id, created_at, status)
     * 3. Guardar en repositorio
     * 4. Retornar evento guardado
     *
     * @param userId ID del usuario que genera el evento
     * @param input Datos del evento
     * @throws Error si validación falla
     */
    async ingest(userId, input) {
        // 1. Validar input (lanza error si falla)
        this.validator.validate(input);
        // 2. Crear AbstractEvent con campos internos
        const event = {
            ...input,
            id: Math.random().toString(36).substring(2, 15),
            user_id: userId,
            created_at: new Date(),
            status: 'pending' // Según fase0/10_MODELO_DATOS_FUNCIONAL.md
        };
        // 3. Guardar en repositorio
        const saved = await this.eventRepository.save(event);
        // 4. Retornar evento guardado
        return saved;
    }
}
exports.EventIngestionService = EventIngestionService;
//# sourceMappingURL=EventIngestionService.js.map