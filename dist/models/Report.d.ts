/**
 * Report entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */
import { ReportStatus } from '../types/enums';
export declare enum ReportCategory {
    HARASSMENT = "harassment",
    SPAM = "spam",
    INAPPROPRIATE_CONTENT = "inappropriate_content",
    IMPERSONATION = "impersonation"
}
export interface Report {
    report_id: string;
    reporter_user_id: string;
    reported_user_id: string;
    reported_at: Date;
    category: ReportCategory;
    details?: string;
    revelation_id?: string;
    moderation_status: ReportStatus;
    auto_blocked: boolean;
}
export declare function validateReportNotSelfReport(report: Report): boolean;
//# sourceMappingURL=Report.d.ts.map