/**
 * Validador de AbstractEvent según fase0/01_ABSTRACCION_DATOS.md
 *
 * Responsabilidades:
 * 1. Validar que SOLO existan campos permitidos (Input vs Stored)
 * 2. Rechazar explícitamente campos prohibidos (anti-GPS)
 * 3. Validar que valores estén en catálogos cerrados
 * 4. Validar formato de week_id
 */
import { AbstractEventInput } from '../types/AbstractEvent.types';
export declare class AbstractEventValidator {
    /**
     * Valida un AbstractEventInput
     *
     * Lanza error si:
     * - Contiene campos prohibidos (anti-GPS)
     * - Contiene campos no permitidos (incluyendo user_id)
     * - Valores no están en catálogos cerrados
     * - week_id tiene formato incorrecto
     */
    validate(input: any): asserts input is AbstractEventInput;
    /**
     * Validación anti-GPS: rechaza cualquier campo prohibido
     */
    private validateNoProhibitedFields;
    /**
     * Validar que solo existan campos permitidos
     */
    private validateOnlyAllowedFields;
    /**
     * Validar campos obligatorios
     */
    private validateRequiredFields;
    /**
     * Validar valores en catálogos cerrados
     */
    private validateCatalogValues;
    /**
     * Validar formato week_id
     */
    private validateWeekId;
}
//# sourceMappingURL=AbstractEventValidator.d.ts.map