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
exports.parseWeekId = parseWeekId;
exports.computeSpanWeeks = computeSpanWeeks;
exports.checkWithin4WeeksSpan = checkWithin4WeeksSpan;
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
/**
 * Parsea un week_id en año y semana
 */
function parseWeekId(weekId) {
    const [yearStr, weekStr] = weekId.split('-W');
    return {
        year: parseInt(yearStr, 10),
        week: parseInt(weekStr, 10)
    };
}
/**
 * Calcula el span de semanas entre dos week_ids (inclusive)
 * Asume que son del mismo año o años consecutivos.
 * Para v1 simplificamos asumiendo que no hay saltos de muchos años.
 */
function computeSpanWeeks(first, last) {
    const p1 = parseWeekId(first);
    const p2 = parseWeekId(last);
    if (p1.year === p2.year) {
        return p2.week - p1.week + 1;
    }
    // Si son años diferentes (ej: 2025-W52 y 2026-W02)
    // Aproximación: (años de diferencia * 52) + semanas
    // Para 4 semanas de ventana, solo nos importan años adyacentes
    const yearDiff = p2.year - p1.year;
    // Usamos 52 como base, aunque algunas semanas tienen 53. 
    // Para una ventana de 4 semanas, si el span es > 4 ya no nos importa la exactitud extrema.
    return (yearDiff * 52) + p2.week - p1.week + 1;
}
/**
 * Verifica si un conjunto de semanas son consecutivas y están dentro de un span de 4 semanas.
 * En LATENTE v1, "consecutivas" se interpreta como que el span entre la primera y la última es <= 4.
 * El requisito dice "4 semanas consecutivas (máximo span entre primer y último week_id usado)".
 */
function checkWithin4WeeksSpan(weekIds) {
    if (weekIds.length === 0)
        return false;
    const sortedWeeks = [...new Set(weekIds)].sort();
    const first = sortedWeeks[0];
    const last = sortedWeeks[sortedWeeks.length - 1];
    return computeSpanWeeks(first, last) <= 4;
}
//# sourceMappingURL=weekIdUtils.js.map