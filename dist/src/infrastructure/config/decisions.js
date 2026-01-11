"use strict";
/**
 * Configuración de decisiones de ventana (Iteración 5a)
 * Fuente: fase0/05_DECISIONES_VENTANA.md y fase0/00_DECISIONES_V1.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DECLINE_COOLDOWN_DAYS = exports.PROPOSAL_TTL_HOURS = exports.PROPOSAL_DURATION_MINUTES = void 0;
// Duración de la ventana activa (ya cerrado en v1)
exports.PROPOSAL_DURATION_MINUTES = 30;
// TTL de la propuesta (tiempo para aceptar/declinar)
// Cerrado en v1: 48 horas
exports.PROPOSAL_TTL_HOURS = 48;
// Cooldown al declinar (cerrado en v1)
exports.DECLINE_COOLDOWN_DAYS = 7;
//# sourceMappingURL=decisions.js.map