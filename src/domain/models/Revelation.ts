/**
 * Revelation entity según ITERACIÓN 6a
 */

export type RevelationStatus = 'active' | 'expired';

export interface Revelation {
  id: string;
  user_a_id: string;
  user_b_id: string;
  pattern_summary: string;
  revealed_at: Date;
  expires_at: Date;
  status: RevelationStatus;
}

export function validateRevelationNoProhibitedFields(revelation: Revelation): boolean {
  const prohibited = [
    'location', 'coordinates', 'latitude', 'longitude'
  ];

  const revelationKeys = Object.keys(revelation);
  const hasProhibited = prohibited.some(field => revelationKeys.includes(field));

  if (hasProhibited) {
    throw new Error('CRÍTICO: Revelation contiene campos prohibidos');
  }

  return true;
}
