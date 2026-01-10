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
/**
 * Parsea un week_id en año y semana
 */
export declare function parseWeekId(weekId: string): {
    year: number;
    week: number;
};
/**
 * Calcula el span de semanas entre dos week_ids (inclusive)
 * Asume que son del mismo año o años consecutivos.
 * Para v1 simplificamos asumiendo que no hay saltos de muchos años.
 */
export declare function computeSpanWeeks(first: string, last: string): number;
/**
 * Verifica si un conjunto de semanas son consecutivas y están dentro de un span de 4 semanas.
 * En LATENTE v1, "consecutivas" se interpreta como que el span entre la primera y la última es <= 4.
 * El requisito dice "4 semanas consecutivas (máximo span entre primer y último week_id usado)".
 */
export declare function checkWithin4WeeksSpan(weekIds: string[]): boolean;
//# sourceMappingURL=weekIdUtils.d.ts.map