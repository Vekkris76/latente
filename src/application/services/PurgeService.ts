import { ConversationRepository } from '../../infrastructure/persistence/memory/ConversationRepository';
import { RecognitionRepository } from '../../infrastructure/persistence/memory/RecognitionRepository';
import { RevelationRepository } from '../../infrastructure/persistence/memory/RevelationRepository';

export class PurgeService {
  constructor(
    private recognitionRepo: RecognitionRepository,
    private revelationRepo: RevelationRepository,
    private conversationRepo: ConversationRepository
  ) {}

  async purgeNonMutualRecognitions(now: Date): Promise<number> {
    return await this.recognitionRepo.purgeExpired(now);
  }

  async purgeExpiredRevelations(now: Date): Promise<number> {
    const expiredIds = await this.revelationRepo.purgeExpired(now);
    for (const id of expiredIds) {
      await this.conversationRepo.deleteByRevelationId(id);
    }
    return expiredIds.length;
  }
}
