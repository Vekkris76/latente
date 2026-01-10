"use strict";
/**
 * Catálogos cerrados extraídos literalmente de fase0/01_ABSTRACCION_DATOS.md
 * NO MODIFICAR SIN ACTUALIZAR FASE 0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROHIBITED_FIELDS = exports.DURATION_BUCKETS = exports.DAY_TYPES = exports.PLACE_CATEGORIES = exports.TIME_BUCKETS = void 0;
// Línea 4: Valores: `morning`, `midday`, `afternoon`, `evening`, `night`
exports.TIME_BUCKETS = [
    'morning',
    'midday',
    'afternoon',
    'evening',
    'night'
];
// Línea 5: Valores: `cafe`, `library`, `park`, `gym`, `coworkorking`, `cultural`, `transport`, `education`, `other`
exports.PLACE_CATEGORIES = [
    'cafe',
    'library',
    'park',
    'gym',
    'coworkorking',
    'cultural',
    'transport',
    'education',
    'other'
];
// Línea 6: Valores: `weekday`, `weekend`, `holiday`
exports.DAY_TYPES = [
    'weekday',
    'weekend',
    'holiday'
];
// Línea 7: Valores: `short` (< 30 min), `medium` (30-90 min), `long` (> 90 min)
exports.DURATION_BUCKETS = [
    'short',
    'medium',
    'long'
];
/**
 * Lista de campos explícitamente PROHIBIDOS según fase0/01_ABSTRACCION_DATOS.md
 * Líneas 11-26
 *
 * Estos campos NUNCA deben aparecer en AbstractEvent
 */
exports.PROHIBITED_FIELDS = [
    // GPS y ubicación
    'latitude',
    'longitude',
    'lat',
    'lon',
    'geohash',
    // Direcciones
    'address',
    'street',
    'postal_code',
    'zip_code',
    // Identificadores de lugares
    'place_name',
    'place_id',
    'venue_id',
    'venue_name',
    'location_name',
    // Delimitación geográfica
    'zone',
    'region',
    'district',
    'neighborhood',
    'area',
    // Proximidad
    'radius',
    'distance',
    'proximity',
    // Dispositivos cercanos
    'bluetooth_id',
    'beacon_id',
    'ble_id',
    // WiFi
    'wifi_ssid',
    'wifi_bssid',
    'ssid',
    'bssid',
    // Telefonía
    'cell_tower_id',
    'lac',
    'cid',
    'mcc',
    'mnc',
    // Identificadores de dispositivo
    'device_id',
    'advertising_id',
    'IMEI',
    'UDID',
    'android_id',
    // Identificadores de usuario en claro
    'user_id_cleartext',
    'email',
    'phone',
    'phone_number',
    // IP
    'ip_address',
    'ip',
    // Timestamps exactos
    'exact_timestamp',
    'timestamp',
    'precise_time',
    // Altura
    'altitude',
    'floor_level',
    'floor',
    'elevation',
    // Movimiento
    'motion_vector',
    'heading',
    'speed',
    'velocity',
    'bearing',
    // Social graph
    'social_graph_ids',
    'contacts',
    'friends',
    'connections'
];
//# sourceMappingURL=catalogs.js.map