import { Adapter } from "../adapter";
export declare function runSafetyFlow(adapter: Adapter, now: Date): Promise<{
    blocked: {
        by: "userA";
        target: "userB";
    };
    copresencesAfterBlock: import("../../../src/domain/models").LatentCoPresence[];
}>;
//# sourceMappingURL=safetyFlow.d.ts.map