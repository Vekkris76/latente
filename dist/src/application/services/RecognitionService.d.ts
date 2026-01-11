import { Recognition } from '../../domain/models/Recognition';
import { ActiveWindowRepository } from '../../infrastructure/persistence/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../infrastructure/persistence/memory/RecognitionRepository';
import { RevelationService } from './RevelationService';
export declare class RecognitionService {
    private activeWindowRepo;
    private recognitionRepo;
    private revelationService;
    constructor(activeWindowRepo: ActiveWindowRepository, recognitionRepo: RecognitionRepository, revelationService: RevelationService);
    confirm(activeWindowId: string, userId: string, now: Date): Promise<Recognition>;
}
//# sourceMappingURL=RecognitionService.d.ts.map