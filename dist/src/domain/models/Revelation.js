"use strict";
/**
 * Revelation entity según ITERACIÓN 6a
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRevelationNoProhibitedFields = validateRevelationNoProhibitedFields;
function validateRevelationNoProhibitedFields(revelation) {
    const prohibited = [
        'location', 'coordinates', 'latitude', 'longitude'
    ];
    const revelationKeys = Object.keys(revelation);
    const hasProhibited = prohibited.some(field => revelationKeys.includes(field));
    if (hasProhibited) {
        throw new Error('CRÍTICO: Revelation contiene campos prohibidos');
    }
    return true;
}
//# sourceMappingURL=Revelation.js.map