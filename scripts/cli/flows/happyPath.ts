import { Adapter } from "../adapter";
import { CLI_USERS } from "../config";

function isoWeek(year: number, week: number) {
  const ww = String(week).padStart(2, "0");
  return `${year}-W${ww}`;
}

export async function runHappyPath(adapter: Adapter, now: Date) {
  const A = CLI_USERS.A;
  const B = CLI_USERS.B;

  // Ingesta eventos que garantizan patrón y overlap:
  const weeksA = [isoWeek(2026, 1), isoWeek(2026, 2), isoWeek(2026, 3)];
  const weeksB = [isoWeek(2026, 2), isoWeek(2026, 3), isoWeek(2026, 4)]; // overlap: W02,W03

  for (const w of weeksA) {
    await adapter.ingestEvent(A, {
      time_bucket: "morning",
      place_category: "cafe",
      day_type: "weekday",
      duration_bucket: "medium",
      week_id: w,
    } as any);
  }

  for (const w of weeksB) {
    await adapter.ingestEvent(B, {
      time_bucket: "morning",
      place_category: "cafe",
      day_type: "weekday",
      duration_bucket: "short",
      week_id: w,
    } as any);
  }

  await adapter.detectPatterns(A);
  await adapter.detectPatterns(B);

  await adapter.detectCoPresences([A, B]);

  const proposals = await adapter.generateProposals(now);
  if (!proposals.length) throw new Error("No se generó propuesta (revisar límites/cooldown/estado)");

  const proposal = proposals[0];

  await adapter.acceptProposal(proposal.id, A, now);
  await adapter.acceptProposal(proposal.id, B, now);

  const aw = await adapter.activateFromProposal(proposal.id, now);

  // Confirmaciones dentro de ventana: now + 1s (si start_time existe)
  const within = (aw as any).start_time instanceof Date
    ? new Date((aw as any).start_time.getTime() + 1000)
    : now;

  await adapter.confirmRecognition((aw as any).id, A, within);
  const recB = await adapter.confirmRecognition((aw as any).id, B, within);

  const revsA = await adapter.getRevelations(A, within);

  return {
    proposal,
    activeWindow: aw,
    recognitionB: recB,
    revelationsA: revsA,
  };
}