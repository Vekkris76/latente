/**
 * Block entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */

import { BlockStatus } from '../types/enums';

export interface Block {
  block_id: string;
  blocker_user_id: string;
  blocked_user_id: string;
  blocked_at: Date;
  reason?: string;                    // Opcional, no mostrado al bloqueado
  revelation_id?: string;             // Si aplica
  status: BlockStatus;
}

// Validación: bloqueo debe ser de A a B, no de A a A
export function validateBlockNotSelfBlock(block: Block): boolean {
  if (block.blocker_user_id === block.blocked_user_id) {
    throw new Error('CRÍTICO: Usuario no puede bloquearse a sí mismo');
  }
  return true;
}
