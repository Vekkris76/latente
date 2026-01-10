"use strict";
/**
 * AbstractEvent entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 * Basado en fase0/01_ABSTRACCION_DATOS.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - latitude, longitude, geohash
 * - place_name, place_id, venue_id, address
 * - bluetooth_id, wifi_ssid, wifi_bssid, cell_tower_id
 * - device_id, exact_timestamp (precisión de segundos)
 * - altitude, floor_level, motion_vector, heading, speed
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAbstractEventNoProhibitedFields = validateAbstractEventNoProhibitedFields;
exports.validateWeekId = validateWeekId;
// Validación de campos prohibidos
function validateAbstractEventNoProhibitedFields(event) {
    const prohibited = [
        'latitude', 'longitude', 'geohash',
        'place_name', 'place_id', 'venue_id', 'address',
        'street', 'postal_code', 'zone', 'region', 'district', 'neighborhood',
        'bluetooth_id', 'beacon_id', 'wifi_ssid', 'wifi_bssid',
        'cell_tower_id', 'lac', 'cid',
        'device_id', 'advertising_id', 'IMEI',
        'exact_timestamp', 'altitude', 'floor_level',
        'motion_vector', 'heading', 'speed',
        'radius', 'distance'
    ];
    const eventKeys = Object.keys(event);
    const hasProhibited = prohibited.some(field => eventKeys.includes(field));
    if (hasProhibited) {
        throw new Error('CRÍTICO: AbstractEvent contiene campos prohibidos');
    }
    return true;
}
// Validación de formato week_id
function validateWeekId(week_id) {
    const weekIdRegex = /^\d{4}-\d{2}$/;
    if (!weekIdRegex.test(week_id)) {
        throw new Error(`Invalid week_id format: ${week_id}. Expected YYYY-WW`);
    }
    return true;
}
//# sourceMappingURL=AbstractEvent.js.map