// scripts/cli/formatters.ts
export function fmtNow(d: Date) {
  // yyyy-mm-dd hh:mm
  const iso = d.toISOString(); // UTC
  return iso.replace("T", " ").slice(0, 16) + "Z";
}

export function labelUser(userId: string, A: string, B: string) {
  return userId === A ? "A" : userId === B ? "B" : userId;
}

export function tryIsoDate(v: any): string {
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return "-";
    return d.toISOString();
  } catch {
    return "-";
  }
}

export function formatProposalLine(p: any, idx: number) {
  const pattern = p.pattern_summary ?? p.patternSummary ?? "-";
  const status = p.status ?? "-";
  const id = p.id ?? "-";
  return `${idx + 1}) ${id} | status=${status} | pattern=${pattern}`;
}

export function formatActiveWindowLine(w: any) {
  const id = w?.id ?? "-";
  const status = w?.status ?? "-";
  const start = w?.start_time ? tryIsoDate(w.start_time) : "-";
  const end = w?.end_time ? tryIsoDate(w.end_time) : "-";
  return `${id} | ${status} | ${start} -> ${end}`;
}

export function formatRevelationLine(r: any, idx: number) {
  const id = r?.id ?? "-";
  const status = r?.status ?? "-";
  const exp = r?.expires_at ? tryIsoDate(r.expires_at) : "-";
  return `${idx + 1}) ${id} | status=${status} | expires_at=${exp}`;
}