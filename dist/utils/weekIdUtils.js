"use strict";
/**
 * Utilidades para week_id según fase0/01_ABSTRACCION_DATOS.md
 *
 * Formato: YYYY-Www (año-semana ISO)
 * Ejemplo: "2026-W02"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWeekIdFormat = validateWeekIdFormat;
exports.getCurrentWeekId = getCurrentWeekId;
/**
 * Valida formato de week_id
 *
 * Reglas Iteración 1:
 * Formato: `YYYY-Www` (año-semana ISO)
 * Regex: /^\d{4}-W\d{2}$/
 * Rango semana: 01-53
 */
function validateWeekIdFormat(week_id) {
    // Formato: 4 dígitos, -W, 2 dígitos
    const weekIdRegex = /^\d{4}-W\d{2}$/;
    if (!weekIdRegex.test(week_id)) {
        return false;
    }
    // Extraer año y semana
    const [yearStr, weekStr] = week_id.split('-W');
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);
    // Validar rangos básicos
    if (year < 1900 || year > 2100) {
        return false;
    }
    // Semana debe estar entre 01 y 53
    if (week < 1 || week > 53) {
        return false;
    }
    return true;
}
/**
 * Obtiene el week_id actual
 *
 * Retorna el identificador de la semana ISO actual en formato YYYY-Www
 */
function getCurrentWeekId() {
    const now = new Date();
    const year = now.getFullYear();
    // Calcular número de semana ISO 8601
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
    // Formatear como YYYY-Www
    const weekStr = weekNumber.toString().padStart(2, '0');
    return `${year}-W${weekStr}`;
}
//# sourceMappingURL=weekIdUtils.js.map