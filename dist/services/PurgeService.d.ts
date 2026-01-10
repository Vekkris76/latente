import { ConversationRepository } from '../repositories/ConversationRepository';
import { RecognitionRepository } from '../repositories/RecognitionRepository';
import { RevelationRepository } from '../repositories/RevelationRepository';
export declare class PurgeService {
    private recognitionRepo;
    private revelationRepo;
    private conversationRepo;
    constructor(recognitionRepo: RecognitionRepository, revelationRepo: RevelationRepository, conversationRepo: ConversationRepository);
    purgeNonMutualRecognitions(now: Date): Promise<number>;
    purgeExpiredRevelations(now: Date): Promise<number>;
}
//# sourceMappingURL=PurgeService.d.ts.map