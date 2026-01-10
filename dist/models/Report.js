"use strict";
/**
 * Report entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportCategory = void 0;
exports.validateReportNotSelfReport = validateReportNotSelfReport;
// TODO: Definir categorías exactas según fase0/08_REVELACION.md
var ReportCategory;
(function (ReportCategory) {
    ReportCategory["HARASSMENT"] = "harassment";
    ReportCategory["SPAM"] = "spam";
    ReportCategory["INAPPROPRIATE_CONTENT"] = "inappropriate_content";
    ReportCategory["IMPERSONATION"] = "impersonation";
})(ReportCategory || (exports.ReportCategory = ReportCategory = {}));
// Validación: usuario no puede reportarse a sí mismo
function validateReportNotSelfReport(report) {
    if (report.reporter_user_id === report.reported_user_id) {
        throw new Error('CRÍTICO: Usuario no puede reportarse a sí mismo');
    }
    return true;
}
//# sourceMappingURL=Report.js.map