/**
 * Block entity según ITERACIÓN 7a
 */

export interface Block {
  id: string;
  blocker_user_id: string;
  blocked_user_id: string;
  created_at: Date;
}

export function validateBlockNotSelfBlock(block: Block): boolean {
  if (block.blocker_user_id === block.blocked_user_id) {
    throw new Error('CRÍTICO: Usuario no puede bloquearse a sí mismo');
  }
  return true;
}
