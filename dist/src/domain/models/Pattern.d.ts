/**
 * Pattern entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_data (cualquier forma)
 * - user_similarity_score, affinity_score
 * - frequency_score, priority_ranking
 */
import { PatternStatus } from '../types/enums';
import { PlaceCategory, TimeBucket, DayType } from '../types/catalogs';
export interface Pattern {
    pattern_id: string;
    user_id: string;
    place_category: PlaceCategory;
    time_bucket: TimeBucket;
    day_type: DayType;
    occurrences_count: number;
    first_week_id: string;
    last_week_id: string;
    pattern_status: PatternStatus;
    detected_at: Date;
}
export declare function validatePatternNoProhibitedFields(pattern: Pattern): boolean;
//# sourceMappingURL=Pattern.d.ts.map