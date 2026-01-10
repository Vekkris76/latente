"use strict";
/**
 * Report entity según ITERACIÓN 7a
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReportNotSelfReport = validateReportNotSelfReport;
function validateReportNotSelfReport(report) {
    if (report.reporter_user_id === report.reported_user_id) {
        throw new Error('CRÍTICO: Usuario no puede reportarse a sí mismo');
    }
    return true;
}
//# sourceMappingURL=Report.js.map