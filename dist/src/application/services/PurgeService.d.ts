import { ConversationRepository } from '../../infrastructure/persistence/memory/ConversationRepository';
import { RecognitionRepository } from '../../infrastructure/persistence/memory/RecognitionRepository';
import { RevelationRepository } from '../../infrastructure/persistence/memory/RevelationRepository';
export declare class PurgeService {
    private recognitionRepo;
    private revelationRepo;
    private conversationRepo;
    constructor(recognitionRepo: RecognitionRepository, revelationRepo: RevelationRepository, conversationRepo: ConversationRepository);
    purgeNonMutualRecognitions(now: Date): Promise<number>;
    purgeExpiredRevelations(now: Date): Promise<number>;
}
//# sourceMappingURL=PurgeService.d.ts.map