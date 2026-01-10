"use strict";
/**
 * Pattern entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_data (cualquier forma)
 * - user_similarity_score, affinity_score
 * - frequency_score, priority_ranking
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatternNoProhibitedFields = validatePatternNoProhibitedFields;
// Validación de campos prohibidos
function validatePatternNoProhibitedFields(pattern) {
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
    // Validación de event_count mínimo (según fase0/02_DEFINICION_PATRONES.md)
    if (pattern.event_count < 3) {
        throw new Error(`Pattern must have at least 3 events, got ${pattern.event_count}`);
    }
    return true;
}
//# sourceMappingURL=Pattern.js.map