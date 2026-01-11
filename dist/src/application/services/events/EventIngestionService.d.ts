/**
 * EventIngestionService - Servicio de ingesta de eventos abstractos
 *
 * Responsabilidades según MVP_TECNICO_MINIMO.md sección 4.2:
 * - Recibe eventos abstractos
 * - Valida campos permitidos (delega a AbstractEventValidator)
 * - Almacena en EventRepository
 */
import { AbstractEventInput, AbstractEvent } from '../../../domain/types/AbstractEvent.types';
import { AbstractEventValidator } from '../../../domain/validation/AbstractEventValidator';
import { EventRepository } from '../../../infrastructure/persistence/memory/EventRepository';
export declare class EventIngestionService {
    private readonly eventRepository;
    private readonly validator;
    constructor(eventRepository: EventRepository, validator: AbstractEventValidator);
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
    ingest(userId: string, input: AbstractEventInput): Promise<AbstractEvent>;
}
//# sourceMappingURL=EventIngestionService.d.ts.map