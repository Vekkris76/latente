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

export function validateReportNotSelfReport(report: Report): boolean {
  if (report.reporter_user_id === report.reported_user_id) {
    throw new Error('CRÍTICO: Usuario no puede reportarse a sí mismo');
  }
  return true;
}
