"use strict";
/**
 * ActiveWindow entity según ITERACIÓN 6a
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateActiveWindowNoProhibitedFields = validateActiveWindowNoProhibitedFields;
function validateActiveWindowNoProhibitedFields(window) {
    const prohibited = [
        'location', 'venue', 'venue_suggestion', 'place_name',
        'map_coordinates', 'coordinates', 'address',
        'other_users_in_window', 'nearby_users',
        'latitude', 'longitude'
    ];
    const windowKeys = Object.keys(window);
    const hasProhibited = prohibited.some(field => windowKeys.includes(field));
    if (hasProhibited) {
        throw new Error('CRÍTICO: ActiveWindow contiene campos prohibidos');
    }
    return true;
}
//# sourceMappingURL=ActiveWindow.js.map