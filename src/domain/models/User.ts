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

import { AccountStatus } from '../types/enums';

export interface User {
  user_id: string;                    // Identificador único interno
  name: string;                       // Nombre del usuario (máx 50 caracteres)
  age: number;                        // TODO: definir si es número exacto o rango
  profile_photo?: string;             // URL o referencia a foto (opcional)
  observation_active: boolean;        // Estado de observación
  created_at: Date;                   // Timestamp de creación
  account_status: AccountStatus;      // Estado de la cuenta
}

// Validación de campos prohibidos
export function validateUserNoProhibitedFields(user: User): boolean {
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
