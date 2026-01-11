/**
 * AbstractEvent entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 * Basado en fase0/01_ABSTRACCION_DATOS.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - latitude, longitude, geohash
 * - place_name, place_id, venue_id, address
 * - bluetooth_id, wifi_ssid, wifi_bssid, cell_tower_id
 * - device_id, exact_timestamp (precisión de segundos)
 * - altitude, floor_level, motion_vector, heading, speed
 */
import { TimeBucket, PlaceCategory, DayType, DurationBucket, AbstractEventStatus } from '../types/enums';
export interface AbstractEvent {
    user_id: string;
    time_bucket: TimeBucket;
    place_category: PlaceCategory;
    day_type: DayType;
    duration_bucket: DurationBucket;
    week_id: string;
    created_at: Date;
    status: AbstractEventStatus;
}
export declare function validateAbstractEventNoProhibitedFields(event: AbstractEvent): boolean;
export declare function validateWeekId(week_id: string): boolean;
//# sourceMappingURL=AbstractEvent.d.ts.map