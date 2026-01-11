"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialState = createInitialState;
exports.getConsents = getConsents;
exports.setConsents = setConsents;
exports.getProfile = getProfile;
exports.setProfile = setProfile;
exports.isOnboarded = isOnboarded;
function createInitialState(now) {
    return {
        consentsByUser: {},
        profileByUser: {},
        now,
    };
}
function getConsents(state, userId) {
    return (state.consentsByUser[userId] ?? {
        abstract_events: false,
        no_gps: false,
        mutual_only: false,
    });
}
function setConsents(state, userId, consents) {
    state.consentsByUser[userId] = consents;
}
function getProfile(state, userId) {
    return state.profileByUser[userId] ?? null;
}
function setProfile(state, userId, profile) {
    state.profileByUser[userId] = profile;
}
function isOnboarded(state, userId) {
    const c = getConsents(state, userId);
    const p = getProfile(state, userId);
    return c.abstract_events && c.no_gps && c.mutual_only && !!p;
}
//# sourceMappingURL=state.js.map