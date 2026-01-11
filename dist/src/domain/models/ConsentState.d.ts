/**
 * ConsentState entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */
import { ConsentStatus } from '../types/enums';
export interface ConsentState {
    user_id: string;
    pattern_detection_consent: boolean;
    location_abstraction_acknowledgment: boolean;
    sync_window_proposals_consent: boolean;
    terms_accepted: boolean;
    privacy_policy_accepted: boolean;
    consent_timestamp: Date;
    status: ConsentStatus;
}
export declare function calculateConsentStatus(consent: Omit<ConsentState, 'status'>): ConsentStatus;
//# sourceMappingURL=ConsentState.d.ts.map