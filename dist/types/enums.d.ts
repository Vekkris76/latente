/**
 * Enums según fase0/01_ABSTRACCION_DATOS.md
 * PROHIBIDO: Añadir campos de ubicación, device_id, o cualquier campo de la lista prohibida
 */
export declare enum TimeBucket {
    MORNING = "morning",
    MIDDAY = "midday",
    AFTERNOON = "afternoon",
    EVENING = "evening",
    NIGHT = "night"
}
export declare enum PlaceCategory {
    CAFE = "cafe",
    LIBRARY = "library",
    PARK = "park",
    GYM = "gym",
    COWORKING = "coworking",
    CULTURAL = "cultural",
    TRANSPORT = "transport",
    EDUCATION = "education",
    OTHER = "other"
}
export declare enum DayType {
    WEEKDAY = "weekday",
    WEEKEND = "weekend",
    HOLIDAY = "holiday"
}
export declare enum DurationBucket {
    SHORT = "short",// < 30 min
    MEDIUM = "medium",// 30-90 min
    LONG = "long"
}
export declare enum AccountStatus {
    ACTIVE = "active",
    ACTIVE_PAUSED = "active_paused",
    SUSPENDED = "suspended",
    DELETED = "deleted"
}
export declare enum ConsentStatus {
    ALL_GRANTED = "all_granted",
    PARTIAL = "partial",
    REVOKED = "revoked"
}
export declare enum AbstractEventStatus {
    PENDING = "pending",
    PROCESSED = "processed",
    EXPIRED = "expired"
}
export declare enum PatternStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    MATCHED = "matched"
}
export declare enum LatentCoPresenceStatus {
    DETECTED = "detected",
    PROPOSED = "proposed",
    ACCEPTED = "accepted",
    EXPIRED = "expired",
    DECLINED = "declined",
    RECOGNIZED_MUTUAL = "recognized_mutual",
    RECOGNIZED_PARTIAL = "recognized_partial",
    NO_RECOGNITION = "no_recognition"
}
export declare enum SyncWindowStatus {
    PROPOSED = "proposed",
    ACCEPTED_BY_BOTH = "accepted_by_both",
    ACTIVE = "active",
    EXPIRED_NO_ACCEPTANCE = "expired_no_acceptance",
    EXPIRED_NO_CONFIRMATION = "expired_no_confirmation",
    COMPLETED_MUTUAL = "completed_mutual",
    DECLINED = "declined"
}
export declare enum RecognitionStatus {
    PENDING = "pending",
    MUTUAL = "mutual",
    UNILATERAL = "unilateral"
}
export declare enum RevelationStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    BLOCKED_BY_A = "blocked_by_a",
    BLOCKED_BY_B = "blocked_by_b",
    MUTUALLY_BLOCKED = "mutually_blocked"
}
export declare enum BlockStatus {
    ACTIVE = "active",
    PERMANENT = "permanent"
}
export declare enum ReportStatus {
    PENDING = "pending",
    UNDER_REVIEW = "under_review",
    ACTION_TAKEN = "action_taken",
    DISMISSED = "dismissed"
}
//# sourceMappingURL=enums.d.ts.map