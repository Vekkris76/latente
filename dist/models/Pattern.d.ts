/**
 * Pattern entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_data (cualquier forma)
 * - user_similarity_score, affinity_score
 * - frequency_score, priority_ranking
 */
import { PlaceCategory, TimeBucket, PatternStatus } from '../types/enums';
export interface Pattern {
    pattern_id: string;
    user_id: string;
    place_category: PlaceCategory;
    time_bucket: TimeBucket;
    event_count: number;
    first_week_id: string;
    last_week_id: string;
    pattern_status: PatternStatus;
    detected_at: Date;
}
export declare function validatePatternNoProhibitedFields(pattern: Pattern): boolean;
//# sourceMappingURL=Pattern.d.ts.map