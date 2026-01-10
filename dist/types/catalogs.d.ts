/**
 * Catálogos cerrados extraídos literalmente de fase0/01_ABSTRACCION_DATOS.md
 * NO MODIFICAR SIN ACTUALIZAR FASE 0
 */
export declare const TIME_BUCKETS: readonly ["morning", "midday", "afternoon", "evening", "night"];
export type TimeBucket = typeof TIME_BUCKETS[number];
export declare const PLACE_CATEGORIES: readonly ["cafe", "library", "park", "gym", "coworkorking", "cultural", "transport", "education", "other"];
export type PlaceCategory = typeof PLACE_CATEGORIES[number];
export declare const DAY_TYPES: readonly ["weekday", "weekend", "holiday"];
export type DayType = typeof DAY_TYPES[number];
export declare const DURATION_BUCKETS: readonly ["short", "medium", "long"];
export type DurationBucket = typeof DURATION_BUCKETS[number];
/**
 * Lista de campos explícitamente PROHIBIDOS según fase0/01_ABSTRACCION_DATOS.md
 * Líneas 11-26
 *
 * Estos campos NUNCA deben aparecer en AbstractEvent
 */
export declare const PROHIBITED_FIELDS: readonly ["latitude", "longitude", "lat", "lon", "geohash", "address", "street", "postal_code", "zip_code", "place_name", "place_id", "venue_id", "venue_name", "location_name", "zone", "region", "district", "neighborhood", "area", "radius", "distance", "proximity", "bluetooth_id", "beacon_id", "ble_id", "wifi_ssid", "wifi_bssid", "ssid", "bssid", "cell_tower_id", "lac", "cid", "mcc", "mnc", "device_id", "advertising_id", "IMEI", "UDID", "android_id", "user_id_cleartext", "email", "phone", "phone_number", "ip_address", "ip", "exact_timestamp", "timestamp", "precise_time", "altitude", "floor_level", "floor", "elevation", "motion_vector", "heading", "speed", "velocity", "bearing", "social_graph_ids", "contacts", "friends", "connections"];
//# sourceMappingURL=catalogs.d.ts.map