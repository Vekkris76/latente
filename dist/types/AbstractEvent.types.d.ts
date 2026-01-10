/**
 * Tipos para AbstractEvent según fase0/01_ABSTRACCION_DATOS.md
 */
import { TimeBucket, PlaceCategory, DayType, DurationBucket } from './catalogs';
/**
 * AbstractEventInput: Campos del input (lo que recibe el sistema)
 *
 * Según reglas de Iteración 1:
 * - time_bucket (obligatorio)
 * - place_category (obligatorio)
 * - day_type (obligatorio)
 * - duration_bucket (obligatorio)
 * - week_id (obligatorio, formato YYYY-Www)
 *
 * user_id NO se incluye en el payload de entrada.
 */
export interface AbstractEventInput {
    time_bucket: TimeBucket;
    place_category: PlaceCategory;
    day_type: DayType;
    duration_bucket: DurationBucket;
    week_id: string;
}
/**
 * AbstractEvent: Entidad almacenada (incluye campos internos)
 *
 * Añade:
 * - id: identificador único generado internamente
 * - user_id: referencia al usuario (asignado internamente)
 * - created_at: timestamp de creación
 * - status: estado del evento
 */
export interface AbstractEvent extends AbstractEventInput {
    id: string;
    user_id: string;
    created_at: Date;
    status: 'pending' | 'processed' | 'expired';
}
//# sourceMappingURL=AbstractEvent.types.d.ts.map