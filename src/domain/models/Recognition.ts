/**
 * Recognition entity según ITERACIÓN 6a
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_at_confirmation
 * - precise_timestamp_shared_with_other_user
 */

export type RecognitionStatus = 'confirmed';

export interface Recognition {
  id: string;
  active_window_id: string;
  user_id: string;
  created_at: Date;
  status: RecognitionStatus;
}

// Validación de campos prohibidos
export function validateRecognitionNoProhibitedFields(recognition: Recognition): boolean {
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
