"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportRepository = void 0;
class ReportRepository {
    constructor() {
        this.reports = new Map();
    }
    async save(report) {
        this.reports.set(report.id, report);
        return report;
    }
    async existsBetween(userA, userB) {
        for (const report of this.reports.values()) {
            if ((report.reporter_user_id === userA && report.reported_user_id === userB) ||
                (report.reporter_user_id === userB && report.reported_user_id === userA)) {
                return true;
            }
        }
        return false;
    }
    async listByReporter(userId) {
        return Array.from(this.reports.values()).filter(r => r.reporter_user_id === userId);
    }
    async clear() {
        this.reports.clear();
    }
}
exports.ReportRepository = ReportRepository;
//# sourceMappingURL=ReportRepository.js.map