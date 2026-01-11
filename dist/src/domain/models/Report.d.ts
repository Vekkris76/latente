/**
 * Report entity según ITERACIÓN 7a
 */
export type ReportReason = 'inappropriate_behavior' | 'harassment' | 'offensive_content' | 'other';
export interface Report {
    id: string;
    reporter_user_id: string;
    reported_user_id: string;
    reason: ReportReason;
    created_at: Date;
}
export declare function validateReportNotSelfReport(report: Report): boolean;
//# sourceMappingURL=Report.d.ts.map