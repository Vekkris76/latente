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
export declare function validateRevelationNoProhibitedFields(revelation: Revelation): boolean;
//# sourceMappingURL=Revelation.d.ts.map