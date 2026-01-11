import { ActiveWindow } from '../../domain/models/ActiveWindow';
import { Revelation } from '../../domain/models/Revelation';
import { ActiveWindowRepository } from '../../infrastructure/persistence/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../infrastructure/persistence/memory/RecognitionRepository';
import { RevelationRepository } from '../../infrastructure/persistence/memory/RevelationRepository';
export declare class RevelationService {
    private revelationRepo;
    private activeWindowRepo;
    private recognitionRepo;
    constructor(revelationRepo: RevelationRepository, activeWindowRepo: ActiveWindowRepository, recognitionRepo: RecognitionRepository);
    createFromActiveWindow(activeWindow: ActiveWindow, now: Date): Promise<Revelation>;
    getRevelationForUser(userId: string, now: Date): Promise<Revelation[]>;
}
//# sourceMappingURL=RevelationService.d.ts.map