"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDayType = getDayType;
exports.getTimeBucketMidpoint = getTimeBucketMidpoint;
exports.addDays = addDays;
exports.addHours = addHours;
exports.formatDate = formatDate;
exports.clampTime = clampTime;
const enums_1 = require("../../domain/types/enums");
function getDayType(date) {
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    // TODO: holiday no puede inferirse sin calendario
    return isWeekend ? enums_1.DayType.WEEKEND : enums_1.DayType.WEEKDAY;
}
function getTimeBucketMidpoint(bucket) {
    switch (bucket) {
        case enums_1.TimeBucket.MORNING:
            return '09:00';
        case enums_1.TimeBucket.MIDDAY:
            // TODO: midday según catálogo, pero NO inventes rango si no está en doc.
            // El doc 04 dice afternoon 12-18 -> 15:00. 
            // Si midday existe en catálogo pero no en doc de rangos, TODO.
            return null;
        case enums_1.TimeBucket.AFTERNOON:
            return '15:00';
        case enums_1.TimeBucket.EVENING:
            return '20:00';
        case enums_1.TimeBucket.NIGHT:
            // TODO: night existe en catálogo pero el doc de rangos no lo define claramente
            return null;
        default:
            return null;
    }
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
function addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}
function formatDate(date) {
    return date.toISOString().split('T')[0];
}
function clampTime(time) {
    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 8)
        return '08:00';
    if (hours > 22 || (hours === 22 && minutes > 0))
        return '22:00';
    return time;
}
//# sourceMappingURL=dateUtils.js.map