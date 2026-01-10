"use strict";
/**
 * User entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - latitude, longitude, last_known_location
 * - device_id, ip_address, advertising_id
 * - social_graph_ids, contact_list
 * - email, phone_number (van en auth, NO aquí)
 * - preferences, filters, search_criteria
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserNoProhibitedFields = validateUserNoProhibitedFields;
// Validación de campos prohibidos
function validateUserNoProhibitedFields(user) {
    const prohibited = [
        'latitude', 'longitude', 'last_known_location',
        'device_id', 'ip_address', 'advertising_id',
        'social_graph_ids', 'contact_list',
        'email', 'phone_number',
        'preferences', 'filters', 'search_criteria'
    ];
    const userKeys = Object.keys(user);
    const hasProhibited = prohibited.some(field => userKeys.includes(field));
    if (hasProhibited) {
        throw new Error('CRÍTICO: User contiene campos prohibidos');
    }
    return true;
}
//# sourceMappingURL=User.js.map