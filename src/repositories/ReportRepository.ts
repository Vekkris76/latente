import { Report } from '../models/Report';

export class ReportRepository {
  private reports: Map<string, Report> = new Map();

  async save(report: Report): Promise<Report> {
    this.reports.set(report.id, report);
    return report;
  }

  async existsBetween(userA: string, userB: string): Promise<boolean> {
    for (const report of this.reports.values()) {
      if (
        (report.reporter_user_id === userA && report.reported_user_id === userB) ||
        (report.reporter_user_id === userB && report.reported_user_id === userA)
      ) {
        return true;
      }
    }
    return false;
  }

  async listByReporter(userId: string): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(r => r.reporter_user_id === userId);
  }

  async clear(): Promise<void> {
    this.reports.clear();
  }
}
