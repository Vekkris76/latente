"use strict";
/**
 * Enums según fase0/01_ABSTRACCION_DATOS.md
 * PROHIBIDO: Añadir campos de ubicación, device_id, o cualquier campo de la lista prohibida
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportStatus = exports.BlockStatus = exports.RevelationStatus = exports.RecognitionStatus = exports.SyncWindowStatus = exports.LatentCoPresenceStatus = exports.PatternStatus = exports.AbstractEventStatus = exports.ConsentStatus = exports.AccountStatus = exports.DurationBucket = exports.DayType = exports.PlaceCategory = exports.TimeBucket = void 0;
var TimeBucket;
(function (TimeBucket) {
    TimeBucket["MORNING"] = "morning";
    TimeBucket["MIDDAY"] = "midday";
    TimeBucket["AFTERNOON"] = "afternoon";
    TimeBucket["EVENING"] = "evening";
    TimeBucket["NIGHT"] = "night";
})(TimeBucket || (exports.TimeBucket = TimeBucket = {}));
var PlaceCategory;
(function (PlaceCategory) {
    PlaceCategory["CAFE"] = "cafe";
    PlaceCategory["LIBRARY"] = "library";
    PlaceCategory["PARK"] = "park";
    PlaceCategory["GYM"] = "gym";
    PlaceCategory["COWORKING"] = "coworking";
    PlaceCategory["CULTURAL"] = "cultural";
    PlaceCategory["TRANSPORT"] = "transport";
    PlaceCategory["EDUCATION"] = "education";
    PlaceCategory["OTHER"] = "other";
})(PlaceCategory || (exports.PlaceCategory = PlaceCategory = {}));
var DayType;
(function (DayType) {
    DayType["WEEKDAY"] = "weekday";
    DayType["WEEKEND"] = "weekend";
    DayType["HOLIDAY"] = "holiday";
})(DayType || (exports.DayType = DayType = {}));
var DurationBucket;
(function (DurationBucket) {
    DurationBucket["SHORT"] = "short";
    DurationBucket["MEDIUM"] = "medium";
    DurationBucket["LONG"] = "long"; // > 90 min
})(DurationBucket || (exports.DurationBucket = DurationBucket = {}));
// Estados de las entidades según fase0/10_MODELO_DATOS_FUNCIONAL.md
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "active";
    AccountStatus["ACTIVE_PAUSED"] = "active_paused";
    AccountStatus["SUSPENDED"] = "suspended";
    AccountStatus["DELETED"] = "deleted";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var ConsentStatus;
(function (ConsentStatus) {
    ConsentStatus["ALL_GRANTED"] = "all_granted";
    ConsentStatus["PARTIAL"] = "partial";
    ConsentStatus["REVOKED"] = "revoked";
})(ConsentStatus || (exports.ConsentStatus = ConsentStatus = {}));
var AbstractEventStatus;
(function (AbstractEventStatus) {
    AbstractEventStatus["PENDING"] = "pending";
    AbstractEventStatus["PROCESSED"] = "processed";
    AbstractEventStatus["EXPIRED"] = "expired";
})(AbstractEventStatus || (exports.AbstractEventStatus = AbstractEventStatus = {}));
var PatternStatus;
(function (PatternStatus) {
    PatternStatus["ACTIVE"] = "active";
    PatternStatus["EXPIRED"] = "expired";
    PatternStatus["MATCHED"] = "matched";
})(PatternStatus || (exports.PatternStatus = PatternStatus = {}));
var LatentCoPresenceStatus;
(function (LatentCoPresenceStatus) {
    LatentCoPresenceStatus["DETECTED"] = "detected";
    LatentCoPresenceStatus["PROPOSED"] = "proposed";
    LatentCoPresenceStatus["ACCEPTED"] = "accepted";
    LatentCoPresenceStatus["EXPIRED"] = "expired";
    LatentCoPresenceStatus["DECLINED"] = "declined";
    LatentCoPresenceStatus["RECOGNIZED_MUTUAL"] = "recognized_mutual";
    LatentCoPresenceStatus["RECOGNIZED_PARTIAL"] = "recognized_partial";
    LatentCoPresenceStatus["NO_RECOGNITION"] = "no_recognition";
})(LatentCoPresenceStatus || (exports.LatentCoPresenceStatus = LatentCoPresenceStatus = {}));
var SyncWindowStatus;
(function (SyncWindowStatus) {
    SyncWindowStatus["PROPOSED"] = "proposed";
    SyncWindowStatus["ACCEPTED_BY_BOTH"] = "accepted_by_both";
    SyncWindowStatus["ACTIVE"] = "active";
    SyncWindowStatus["EXPIRED_NO_ACCEPTANCE"] = "expired_no_acceptance";
    SyncWindowStatus["EXPIRED_NO_CONFIRMATION"] = "expired_no_confirmation";
    SyncWindowStatus["COMPLETED_MUTUAL"] = "completed_mutual";
    SyncWindowStatus["DECLINED"] = "declined";
})(SyncWindowStatus || (exports.SyncWindowStatus = SyncWindowStatus = {}));
var RecognitionStatus;
(function (RecognitionStatus) {
    RecognitionStatus["PENDING"] = "pending";
    RecognitionStatus["MUTUAL"] = "mutual";
    RecognitionStatus["UNILATERAL"] = "unilateral";
})(RecognitionStatus || (exports.RecognitionStatus = RecognitionStatus = {}));
var RevelationStatus;
(function (RevelationStatus) {
    RevelationStatus["ACTIVE"] = "active";
    RevelationStatus["EXPIRED"] = "expired";
    RevelationStatus["BLOCKED_BY_A"] = "blocked_by_a";
    RevelationStatus["BLOCKED_BY_B"] = "blocked_by_b";
    RevelationStatus["MUTUALLY_BLOCKED"] = "mutually_blocked";
})(RevelationStatus || (exports.RevelationStatus = RevelationStatus = {}));
var BlockStatus;
(function (BlockStatus) {
    BlockStatus["ACTIVE"] = "active";
    BlockStatus["PERMANENT"] = "permanent";
})(BlockStatus || (exports.BlockStatus = BlockStatus = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "pending";
    ReportStatus["UNDER_REVIEW"] = "under_review";
    ReportStatus["ACTION_TAKEN"] = "action_taken";
    ReportStatus["DISMISSED"] = "dismissed";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
//# sourceMappingURL=enums.js.map