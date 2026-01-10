/**
 * Revelation entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_data, meeting_place_suggestion
 * - other_shared_patterns
 * - compatibility_score, affinity_metrics
 */
import { PlaceCategory, TimeBucket, RevelationStatus } from '../types/enums';
export interface Revelation {
    revelation_id: string;
    window_id: string;
    user_a_id: string;
    user_b_id: string;
    revealed_at: Date;
    expires_at: Date;
    conversation_status: RevelationStatus;
    shared_pattern_category: PlaceCategory;
    shared_pattern_time_bucket: TimeBucket;
}
export declare function validateRevelationNoProhibitedFields(revelation: Revelation): boolean;
export declare function calculateExpiresAt(revealed_at: Date): Date;
//# sourceMappingURL=Revelation.d.ts.map