/**
 * ConversationMessage entity según ITERACIÓN 6a
 */

export interface ConversationMessage {
  id: string;
  revelation_id: string;
  sender_user_id: string;
  text: string;
  created_at: Date;
}
