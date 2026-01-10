"use strict";
/**
 * ConsentState entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateConsentStatus = calculateConsentStatus;
const enums_1 = require("../types/enums");
function calculateConsentStatus(consent) {
    const allGranted = consent.pattern_detection_consent &&
        consent.location_abstraction_acknowledgment &&
        consent.sync_window_proposals_consent &&
        consent.terms_accepted &&
        consent.privacy_policy_accepted;
    if (allGranted) {
        return enums_1.ConsentStatus.ALL_GRANTED;
    }
    return enums_1.ConsentStatus.PARTIAL;
}
//# sourceMappingURL=ConsentState.js.map