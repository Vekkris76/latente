import { Report } from '../../../domain/models/Report';
export declare class ReportRepository {
    private reports;
    save(report: Report): Promise<Report>;
    existsBetween(userA: string, userB: string): Promise<boolean>;
    listByReporter(userId: string): Promise<Report[]>;
    clear(): Promise<void>;
}
//# sourceMappingURL=ReportRepository.d.ts.map