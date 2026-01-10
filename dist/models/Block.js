"use strict";
/**
 * Block entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlockNotSelfBlock = validateBlockNotSelfBlock;
// Validación: bloqueo debe ser de A a B, no de A a A
function validateBlockNotSelfBlock(block) {
    if (block.blocker_user_id === block.blocked_user_id) {
        throw new Error('CRÍTICO: Usuario no puede bloquearse a sí mismo');
    }
    return true;
}
//# sourceMappingURL=Block.js.map