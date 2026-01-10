import { PatternRepository } from '../../repositories/PatternRepository';
import { CoPresenceRepository } from '../../repositories/CoPresenceRepository';
import { EventRepository } from '../../repositories/EventRepository';
import { BlockRepository } from '../../repositories/BlockRepository';
import { ReportRepository } from '../../repositories/ReportRepository';
import { ProposalStateRepository } from '../../repositories/ProposalStateRepository';
import { LatentCoPresence } from '../../models/LatentCoPresence';
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