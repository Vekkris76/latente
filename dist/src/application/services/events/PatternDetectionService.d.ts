import { Pattern } from '../../../domain/models/Pattern';
import { EventRepository } from '../../../infrastructure/persistence/memory/EventRepository';
import { PatternRepository } from '../../../infrastructure/persistence/memory/PatternRepository';
export declare class PatternDetectionService {
    private eventRepository;
    private patternRepository;
    constructor(eventRepository: EventRepository, patternRepository: PatternRepository);
    detectForUser(userId: string): Promise<Pattern[]>;
}
//# sourceMappingURL=PatternDetectionService.d.ts.map