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

import { TimeBucket, PlaceCategory, DayType, DurationBucket, AbstractEventStatus } from '../types/enums';

export interface AbstractEvent {
  user_id: string;
  time_bucket: TimeBucket;
  place_category: PlaceCategory;
  day_type: DayType;
  duration_bucket: DurationBucket;
  week_id: string;                // Formato YYYY-WW (ISO week)
  created_at: Date;                // Con precisión reducida después del procesamiento
  status: AbstractEventStatus;
}

// Validación de campos prohibidos
export function validateAbstractEventNoProhibitedFields(event: AbstractEvent): boolean {
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
export function validateWeekId(week_id: string): boolean {
  const weekIdRegex = /^\d{4}-\d{2}$/;
  if (!weekIdRegex.test(week_id)) {
    throw new Error(`Invalid week_id format: ${week_id}. Expected YYYY-WW`);
  }
  return true;
}
