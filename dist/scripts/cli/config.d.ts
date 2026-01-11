export declare const CLI_USERS: {
    readonly A: "userA";
    readonly B: "userB";
};
export type CliUserId = typeof CLI_USERS[keyof typeof CLI_USERS];
export declare const REPORT_REASONS: readonly ["spam", "harassment", "impersonation", "other"];
export type ReportReason = typeof REPORT_REASONS[number];
export declare const DEFAULT_NOW_ISO = "2026-01-10T10:00:00.000Z";
//# sourceMappingURL=config.d.ts.map