/**
 * Utilidades para week_id según fase0/01_ABSTRACCION_DATOS.md
 *
 * Formato: YYYY-Www (año-semana ISO)
 * Ejemplo: "2026-W02"
 */
/**
 * Valida formato de week_id
 *
 * Reglas Iteración 1:
 * Formato: `YYYY-Www` (año-semana ISO)
 * Regex: /^\d{4}-W\d{2}$/
 * Rango semana: 01-53
 */
export declare function validateWeekIdFormat(week_id: string): boolean;
/**
 * Obtiene el week_id actual
 *
 * Retorna el identificador de la semana ISO actual en formato YYYY-Www
 */
export declare function getCurrentWeekId(): string;
//# sourceMappingURL=weekIdUtils.d.ts.map