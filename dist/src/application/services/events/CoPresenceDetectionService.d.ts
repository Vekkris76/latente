import { PatternRepository } from '../../../infrastructure/persistence/memory/PatternRepository';
import { CoPresenceRepository } from '../../../infrastructure/persistence/memory/CoPresenceRepository';
import { EventRepository } from '../../../infrastructure/persistence/memory/EventRepository';
import { BlockRepository } from '../../../infrastructure/persistence/memory/BlockRepository';
import { ReportRepository } from '../../../infrastructure/persistence/memory/ReportRepository';
import { ProposalStateRepository } from '../../../infrastructure/persistence/memory/ProposalStateRepository';
import { LatentCoPresence } from '../../../domain/models/LatentCoPresence';
export declare class CoPresenceDetectionService {
    private patternRepository;
    private eventRepository;
    private copresenceRepository;
    private blockRepository;
    private reportRepository;
    private proposalStateRepository;
    constructor(patternRepository: PatternRepository, eventRepository: EventRepository, copresenceRepository: CoPresenceRepository, blockRepository: BlockRepository, reportRepository: ReportRepository, proposalStateRepository: ProposalStateRepository);
    detectForUsers(userIds: string[]): Promise<LatentCoPresence[]>;
}
//# sourceMappingURL=CoPresenceDetectionService.d.ts.map