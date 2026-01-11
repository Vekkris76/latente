import { AbstractEventInput } from "../../src/domain/types/AbstractEvent.types";
import { WindowProposalRepository } from "../../src/infrastructure/persistence/memory/WindowProposalRepository";
import { ActiveWindowRepository } from "../../src/infrastructure/persistence/memory/ActiveWindowRepository";
export type Adapter = ReturnType<typeof createAdapter>;
export declare function createAdapter(): {
    ingestEvent: (userId: string, input: AbstractEventInput) => Promise<import("../../src/domain/types/AbstractEvent.types").AbstractEvent>;
    detectPatterns: (userId: string) => Promise<import("../../src/domain/models").Pattern[]>;
    detectCoPresences: (userIds: string[]) => Promise<import("../../src/domain/models").LatentCoPresence[]>;
    generateProposals: (now: Date) => Promise<import("../../src/domain/models/WindowProposal").WindowProposal[]>;
    acceptProposal: (proposalId: string, userId: string, now: Date) => Promise<import("../../src/domain/models/WindowProposal").WindowProposal>;
    declineProposal: (proposalId: string, userId: string, now: Date) => Promise<import("../../src/domain/models/WindowProposal").WindowProposal>;
    expireProposals: (now: Date) => Promise<number>;
    activateFromProposal: (proposalId: string, now: Date) => Promise<import("../../src/domain/models").ActiveWindow>;
    getActiveWindowForUser: (userId: string, now: Date) => Promise<import("../../src/domain/models").ActiveWindow | null>;
    confirmRecognition: (activeWindowId: string, userId: string, now: Date) => Promise<import("../../src/domain/models").Recognition>;
    getRevelations: (userId: string, now: Date) => Promise<import("../../src/domain/models").Revelation[]>;
    block: (userId: string, otherUserId: string, now: Date) => Promise<any>;
    report: (userId: string, otherUserId: string, reason: string, text: string | undefined, now: Date) => Promise<any>;
    deleteAccount: (userId: string, now: Date) => Promise<any>;
    listEventsByUser: (userId: string) => Promise<any>;
    listPatternsByUser: (userId: string) => Promise<any>;
    listCoPresences: () => Promise<any>;
    listProposals: () => Promise<any>;
    listActiveWindows: () => Promise<any>;
    _repos: {
        proposalRepo: WindowProposalRepository;
        activeWindowRepo: ActiveWindowRepository;
    };
};
//# sourceMappingURL=adapter.d.ts.map