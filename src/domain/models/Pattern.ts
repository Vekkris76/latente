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
  occurrences_count: number;      // >= 3 según fase0/02_DEFINICION_PATRONES.md
  first_week_id: string;          // Formato YYYY-WW
  last_week_id: string;           // Formato YYYY-WW
  pattern_status: PatternStatus;
  detected_at: Date;
}

// Validación de campos prohibidos
export function validatePatternNoProhibitedFields(pattern: Pattern): boolean {
  const prohibited = [
    'location_data', 'location', 'coordinates',
    'user_similarity_score', 'affinity_score',
    'frequency_score', 'priority_ranking',
    'score', 'rank', 'priority'
  ];

  const patternKeys = Object.keys(pattern);
  const hasProhibited = prohibited.some(field => patternKeys.includes(field));

  if (hasProhibited) {
    throw new Error('CRÍTICO: Pattern contiene campos prohibidos');
  }

  // Validación de occurrences_count mínimo (según fase0/02_DEFINICION_PATRONES.md)
  if (pattern.occurrences_count < 3) {
    throw new Error(`Pattern must have at least 3 events, got ${pattern.occurrences_count}`);
  }

  return true;
}
