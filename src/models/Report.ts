/**
 * Report entity según fase0/10_MODELO_DATOS_FUNCIONAL.md
 */

import { ReportStatus } from '../types/enums';

// TODO: Definir categorías exactas según fase0/08_REVELACION.md
export enum ReportCategory {
  HARASSMENT = 'harassment',
  SPAM = 'spam',
  INAPPROPRIATE_CONTENT = 'inappropriate_content',
  IMPERSONATION = 'impersonation'
}

export interface Report {
  report_id: string;
  reporter_user_id: string;
  reported_user_id: string;
  reported_at: Date;
  category: ReportCategory;
  details?: string;                      // Texto libre opcional
  revelation_id?: string;                // Si aplica
  moderation_status: ReportStatus;
  auto_blocked: boolean;
}

// Validación: usuario no puede reportarse a sí mismo
export function validateReportNotSelfReport(report: Report): boolean {
  if (report.reporter_user_id === report.reported_user_id) {
    throw new Error('CRÍTICO: Usuario no puede reportarse a sí mismo');
  }
  return true;
}
