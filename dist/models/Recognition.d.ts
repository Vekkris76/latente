/**
 * Recognition entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - location_at_confirmation
 * - precise_timestamp_shared_with_other_user
 */
import { RecognitionStatus } from '../types/enums';
export interface Recognition {
    recognition_id: string;
    window_id: string;
    user_id: string;
    confirmed_at: Date;
    is_mutual: boolean;
    status: RecognitionStatus;
}
export declare function validateRecognitionNoProhibitedFields(recognition: Recognition): boolean;
//# sourceMappingURL=Recognition.d.ts.map