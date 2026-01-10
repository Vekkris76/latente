/**
 * SyncWindow entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location, venue_suggestion, map_coordinates
 * - other_users_in_window
 */

import { SyncWindowStatus } from '../types/enums';

export interface SyncWindow {
  window_id: string;
  copresence_id: string;
  user_a_id: string;
  user_b_id: string;
  proposed_date: string;          // Día específico (YYYY-MM-DD)
  start_time: string;             // Hora de inicio (HH:MM)
  end_time: string;               // Hora de fin (HH:MM)
  duration_minutes: number;       // 30-45 según fase0/00_DECISIONES_V1.md
  window_status: SyncWindowStatus;
  user_a_accepted: boolean;
  user_b_accepted: boolean;
  user_a_accepted_at?: Date;
  user_b_accepted_at?: Date;
}

// Validación de campos prohibidos
export function validateSyncWindowNoProhibitedFields(window: SyncWindow): boolean {
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
