/**
 * DTOs de respuesta para asegurar que no se devuelva PII.
 * Regla: Prohibido devolver email, nombre real, foto, IP, device ids.
 */

export interface UserResponseDTO {
  user_id: string;
  age: number;
  observation_active: boolean;
  account_status: string;
  created_at: string;
}

export interface EventResponseDTO {
  id: string;
  time_bucket: string;
  place_category: string;
  day_type: string;
  duration_bucket: string;
  week_id: string;
  status: string;
  created_at: string;
}

export interface RevelationResponseDTO {
  id: string;
  pattern_summary: string;
  revealed_at: string;
  expires_at: string;
  status: string;
}

export interface MessageResponseDTO {
  id: string;
  revelation_id: string;
  sender_id: string; // UUID, no PII
  content: string;
  sent_at: string;
}

export interface AuthResponseDTO {
  access_token: string;
  refresh_token: string;
  user: UserResponseDTO;
}

export interface SuccessResponseDTO {
  success: boolean;
  message?: string;
}
