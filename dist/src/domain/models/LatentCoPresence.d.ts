/**
 * LatentCoPresence entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - score, affinity, compatibility_percentage
 * - location_overlap, proximity_estimate
 * - number_of_shared_patterns
 */
import { LatentCoPresenceStatus } from '../types/enums';
import { PlaceCategory, TimeBucket } from '../types/catalogs';
export interface LatentCoPresence {
    copresence_id: string;
    user_a_id: string;
    user_b_id: string;
    pattern_id_a: string;
    pattern_id_b: string;
    shared_place_category: PlaceCategory;
    shared_time_bucket: TimeBucket;
    overlap_week_ids: string[];
    detected_at: Date;
    status: LatentCoPresenceStatus;
}
export declare function validateLatentCoPresenceNoProhibitedFields(copresence: LatentCoPresence): boolean;
//# sourceMappingURL=LatentCoPresence.d.ts.map