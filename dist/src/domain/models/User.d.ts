/**
 * User entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 *
 * CAMPOS PROHIBIDOS (verificar en tests):
 * - latitude, longitude, last_known_location
 * - device_id, ip_address, advertising_id
 * - social_graph_ids, contact_list
 * - email, phone_number (van en auth, NO aquí)
 * - preferences, filters, search_criteria
 */
import { AccountStatus } from '../types/enums';
export interface User {
    user_id: string;
    name: string;
    age: number;
    profile_photo?: string;
    observation_active: boolean;
    created_at: Date;
    account_status: AccountStatus;
}
export declare function validateUserNoProhibitedFields(user: User): boolean;
//# sourceMappingURL=User.d.ts.map