import { ConversationMessage } from '../models/ConversationMessage';
import { IRepository } from './IRepository';
export declare class ConversationRepository implements IRepository<ConversationMessage> {
    private messages;
    save(entity: ConversationMessage): Promise<ConversationMessage>;
    findById(id: string): Promise<ConversationMessage | null>;
    findByRevelationId(revelationId: string): Promise<ConversationMessage[]>;
    deleteByRevelationId(revelationId: string): Promise<void>;
    deleteByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=ConversationRepository.d.ts.map