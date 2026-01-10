export const CLI_USERS = {
  A: "userA",
  B: "userB",
} as const;

export type CliUserId = typeof CLI_USERS[keyof typeof CLI_USERS];

export const REPORT_REASONS = [
  "spam",
  "harassment",
  "impersonation",
  "other",
] as const;

export type ReportReason = typeof REPORT_REASONS[number];

// “Ahora” determinista para demos (puedes cambiarlo desde el menú)
export const DEFAULT_NOW_ISO = "2026-01-10T10:00:00.000Z";