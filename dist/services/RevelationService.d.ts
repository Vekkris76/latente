import { ActiveWindow } from '../models/ActiveWindow';
import { Revelation } from '../models/Revelation';
import { ActiveWindowRepository } from '../repositories/ActiveWindowRepository';
import { RecognitionRepository } from '../repositories/RecognitionRepository';
import { RevelationRepository } from '../repositories/RevelationRepository';
export declare class RevelationService {
    private revelationRepo;
    private activeWindowRepo;
    private recognitionRepo;
    constructor(revelationRepo: RevelationRepository, activeWindowRepo: ActiveWindowRepository, recognitionRepo: RecognitionRepository);
    createFromActiveWindow(activeWindow: ActiveWindow, now: Date): Promise<Revelation>;
    getRevelationForUser(userId: string, now: Date): Promise<Revelation[]>;
}
//# sourceMappingURL=RevelationService.d.ts.map