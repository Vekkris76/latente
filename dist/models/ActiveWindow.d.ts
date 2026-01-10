/**
 * ActiveWindow entity según ITERACIÓN 6a
 */
export type ActiveWindowStatus = 'active' | 'completed';
export interface ActiveWindow {
    id: string;
    proposal_id: string;
    user_a_id: string;
    user_b_id: string;
    start_time: Date;
    end_time: Date;
    status: ActiveWindowStatus;
    created_at: Date;
}
export declare function validateActiveWindowNoProhibitedFields(window: ActiveWindow): boolean;
//# sourceMappingURL=ActiveWindow.d.ts.map