/**
 * Recognition entity según ITERACIÓN 6a
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_at_confirmation
 * - precise_timestamp_shared_with_other_user
 */
export type RecognitionStatus = 'confirmed';
export interface Recognition {
    id: string;
    active_window_id: string;
    user_id: string;
    created_at: Date;
    status: RecognitionStatus;
}
export declare function validateRecognitionNoProhibitedFields(recognition: Recognition): boolean;
//# sourceMappingURL=Recognition.d.ts.map