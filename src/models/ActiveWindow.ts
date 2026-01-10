/**
 * ActiveWindow entity según ITERACIÓN 6a
 */

export type ActiveWindowStatus = 'active' | 'completed';

export interface ActiveWindow {
  id: string;
  proposal_id: string;
  user_a_id: string;
  user_b_id: string;
  start_time: Date;
  end_time: Date;
  status: ActiveWindowStatus;
  created_at: Date;
}

export function validateActiveWindowNoProhibitedFields(window: ActiveWindow): boolean {
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
