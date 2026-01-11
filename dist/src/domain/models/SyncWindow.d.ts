/**
 * SyncWindow entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location, venue_suggestion, map_coordinates
 * - other_users_in_window
 */
import { SyncWindowStatus } from '../types/enums';
export interface SyncWindow {
    window_id: string;
    copresence_id: string;
    user_a_id: string;
    user_b_id: string;
    proposed_date: string;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    window_status: SyncWindowStatus;
    user_a_accepted: boolean;
    user_b_accepted: boolean;
    user_a_accepted_at?: Date;
    user_b_accepted_at?: Date;
}
export declare function validateSyncWindowNoProhibitedFields(window: SyncWindow): boolean;
//# sourceMappingURL=SyncWindow.d.ts.map