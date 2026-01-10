"use strict";
/**
 * Block entity según ITERACIÓN 7a
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBlockNotSelfBlock = validateBlockNotSelfBlock;
function validateBlockNotSelfBlock(block) {
    if (block.blocker_user_id === block.blocked_user_id) {
        throw new Error('CRÍTICO: Usuario no puede bloquearse a sí mismo');
    }
    return true;
}
//# sourceMappingURL=Block.js.map