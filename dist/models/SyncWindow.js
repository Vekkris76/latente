"use strict";
/**
 * SyncWindow entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location, venue_suggestion, map_coordinates
 * - other_users_in_window
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSyncWindowNoProhibitedFields = validateSyncWindowNoProhibitedFields;
// Validación de campos prohibidos
function validateSyncWindowNoProhibitedFields(window) {
    const prohibited = [
        'location', 'venue', 'venue_suggestion', 'place_name',
        'map_coordinates', 'coordinates', 'address',
        'other_users_in_window', 'nearby_users',
        'latitude', 'longitude'
    ];
    const windowKeys = Object.keys(window);
    const hasProhibited = prohibited.some(field => windowKeys.includes(field));
    if (hasProhibited) {
        throw new Error('CRÍTICO: SyncWindow contiene campos prohibidos');
    }
    // Validación de duración según fase0/00_DECISIONES_V1.md
    if (window.duration_minutes < 30 || window.duration_minutes > 45) {
        throw new Error(`Window duration must be 30-45 minutes, got ${window.duration_minutes}`);
    }
    return true;
}
//# sourceMappingURL=SyncWindow.js.map