import { Pattern } from '../../models/Pattern';
import { EventRepository } from '../../repositories/EventRepository';
import { PatternRepository } from '../../repositories/PatternRepository';
export declare class PatternDetectionService {
    private eventRepository;
    private patternRepository;
    constructor(eventRepository: EventRepository, patternRepository: PatternRepository);
    detectForUser(userId: string): Promise<Pattern[]>;
}
//# sourceMappingURL=PatternDetectionService.d.ts.map