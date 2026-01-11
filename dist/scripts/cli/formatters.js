"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fmtNow = fmtNow;
exports.labelUser = labelUser;
exports.tryIsoDate = tryIsoDate;
exports.formatProposalLine = formatProposalLine;
exports.formatActiveWindowLine = formatActiveWindowLine;
exports.formatRevelationLine = formatRevelationLine;
// scripts/cli/formatters.ts
function fmtNow(d) {
    // yyyy-mm-dd hh:mm
    const iso = d.toISOString(); // UTC
    return iso.replace("T", " ").slice(0, 16) + "Z";
}
function labelUser(userId, A, B) {
    return userId === A ? "A" : userId === B ? "B" : userId;
}
function tryIsoDate(v) {
    try {
        const d = new Date(v);
        if (isNaN(d.getTime()))
            return "-";
        return d.toISOString();
    }
    catch {
        return "-";
    }
}
function formatProposalLine(p, idx) {
    const pattern = p.pattern_summary ?? p.patternSummary ?? "-";
    const status = p.status ?? "-";
    const id = p.id ?? "-";
    return `${idx + 1}) ${id} | status=${status} | pattern=${pattern}`;
}
function formatActiveWindowLine(w) {
    const id = w?.id ?? "-";
    const status = w?.status ?? "-";
    const start = w?.start_time ? tryIsoDate(w.start_time) : "-";
    const end = w?.end_time ? tryIsoDate(w.end_time) : "-";
    return `${id} | ${status} | ${start} -> ${end}`;
}
function formatRevelationLine(r, idx) {
    const id = r?.id ?? "-";
    const status = r?.status ?? "-";
    const exp = r?.expires_at ? tryIsoDate(r.expires_at) : "-";
    return `${idx + 1}) ${id} | status=${status} | expires_at=${exp}`;
}
//# sourceMappingURL=formatters.js.map