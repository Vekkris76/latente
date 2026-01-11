"use strict";
/**
 * LatentCoPresence entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - score, affinity, compatibility_percentage
 * - location_overlap, proximity_estimate
 * - number_of_shared_patterns
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLatentCoPresenceNoProhibitedFields = validateLatentCoPresenceNoProhibitedFields;
// Validación de campos prohibidos
function validateLatentCoPresenceNoProhibitedFields(copresence) {
    const prohibited = [
        'score', 'affinity', 'compatibility_percentage',
        'match_score', 'similarity_score',
        'location_overlap', 'proximity_estimate',
        'distance', 'proximity',
        'number_of_shared_patterns', 'shared_patterns_count'
    ];
    const copresenceKeys = Object.keys(copresence);
    const hasProhibited = prohibited.some(field => copresenceKeys.includes(field));
    if (hasProhibited) {
        throw new Error('CRÍTICO: LatentCoPresence contiene campos prohibidos');
    }
    return true;
}
//# sourceMappingURL=LatentCoPresence.js.map