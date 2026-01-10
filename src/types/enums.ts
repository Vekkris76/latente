/**
 * Enums según fase0/01_ABSTRACCION_DATOS.md
 * PROHIBIDO: Añadir campos de ubicación, device_id, o cualquier campo de la lista prohibida
 */

export enum TimeBucket {
  MORNING = 'morning',
  MIDDAY = 'midday',
  AFTERNOON = 'afternoon',
  EVENING = 'evening',
  NIGHT = 'night'
}

export enum PlaceCategory {
  CAFE = 'cafe',
  LIBRARY = 'library',
  PARK = 'park',
  GYM = 'gym',
  COWORKING = 'coworking',
  CULTURAL = 'cultural',
  TRANSPORT = 'transport',
  EDUCATION = 'education',
  OTHER = 'other'
}

export enum DayType {
  WEEKDAY = 'weekday',
  WEEKEND = 'weekend',
  HOLIDAY = 'holiday'
}

export enum DurationBucket {
  SHORT = 'short',   // < 30 min
  MEDIUM = 'medium', // 30-90 min
  LONG = 'long'      // > 90 min
}

// Estados de las entidades según fase0/10_MODELO_DATOS_FUNCIONAL.md

export enum AccountStatus {
  ACTIVE = 'active',
  ACTIVE_PAUSED = 'active_paused',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export enum ConsentStatus {
  ALL_GRANTED = 'all_granted',
  PARTIAL = 'partial',
  REVOKED = 'revoked'
}

export enum AbstractEventStatus {
  PENDING = 'pending',
  PROCESSED = 'processed',
  EXPIRED = 'expired'
}

export enum PatternStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  MATCHED = 'matched'
}

export enum LatentCoPresenceStatus {
  DETECTED = 'detected',
  PROPOSED = 'proposed',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  DECLINED = 'declined',
  RECOGNIZED_MUTUAL = 'recognized_mutual',
  RECOGNIZED_PARTIAL = 'recognized_partial',
  NO_RECOGNITION = 'no_recognition'
}

export enum SyncWindowStatus {
  PROPOSED = 'proposed',
  ACCEPTED_BY_BOTH = 'accepted_by_both',
  ACTIVE = 'active',
  EXPIRED_NO_ACCEPTANCE = 'expired_no_acceptance',
  EXPIRED_NO_CONFIRMATION = 'expired_no_confirmation',
  COMPLETED_MUTUAL = 'completed_mutual',
  DECLINED = 'declined'
}

export enum RecognitionStatus {
  PENDING = 'pending',
  MUTUAL = 'mutual',
  UNILATERAL = 'unilateral'
}

export enum RevelationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  BLOCKED_BY_A = 'blocked_by_a',
  BLOCKED_BY_B = 'blocked_by_b',
  MUTUALLY_BLOCKED = 'mutually_blocked'
}

export enum BlockStatus {
  ACTIVE = 'active',
  PERMANENT = 'permanent'
}

export enum ReportStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  ACTION_TAKEN = 'action_taken',
  DISMISSED = 'dismissed'
}
