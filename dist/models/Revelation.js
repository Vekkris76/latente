"use strict";
/**
 * Revelation entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_data, meeting_place_suggestion
 * - other_shared_patterns
 * - compatibility_score, affinity_metrics
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRevelationNoProhibitedFields = validateRevelationNoProhibitedFields;
exports.calculateExpiresAt = calculateExpiresAt;
// Validación de campos prohibidos
function validateRevelationNoProhibitedFields(revelation) {
    const prohibited = [
        'location_data', 'location', 'meeting_place', 'meeting_place_suggestion',
        'place_name', 'venue', 'address',
        'other_shared_patterns', 'shared_patterns_list',
        'compatibility_score', 'affinity_metrics', 'match_score',
        'score', 'ranking'
    ];
    const revelationKeys = Object.keys(revelation);
    const hasProhibited = prohibited.some(field => revelationKeys.includes(field));
    if (hasProhibited) {
        throw new Error('CRÍTICO: Revelation contiene campos prohibidos');
    }
    return true;
}
// Validación de TTL según fase0/00_DECISIONES_V1.md
function calculateExpiresAt(revealed_at) {
    const expires = new Date(revealed_at);
    expires.setDate(expires.getDate() + 7); // 7 días
    return expires;
}
//# sourceMappingURL=Revelation.js.map