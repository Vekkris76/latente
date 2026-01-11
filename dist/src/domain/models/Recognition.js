"use strict";
/**
 * Recognition entity según ITERACIÓN 6a
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_at_confirmation
 * - precise_timestamp_shared_with_other_user
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecognitionNoProhibitedFields = validateRecognitionNoProhibitedFields;
// Validación de campos prohibidos
function validateRecognitionNoProhibitedFields(recognition) {
    const prohibited = [
        'location_at_confirmation', 'location', 'coordinates',
        'precise_timestamp_shared_with_other_user',
        'latitude', 'longitude'
    ];
    const recognitionKeys = Object.keys(recognition);
    const hasProhibited = prohibited.some(field => recognitionKeys.includes(field));
    if (hasProhibited) {
        throw new Error('CRÍTICO: Recognition contiene campos prohibidos');
    }
    return true;
}
//# sourceMappingURL=Recognition.js.map