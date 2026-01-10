/**
 * LATENTE — Demo E2E (Sad Paths) sin HTTP
 *
 * Escenarios:
 * S1: Decline explícito -> cooldown (7 días) al que declina
 * S2: Timeout propuesta (TTL=48h) -> expira sin cooldown
 * S3: No-mutual en ventana activa -> purge silenciosa tras 24h (TTL)
 *
 * Sin cron: simulamos el paso del tiempo y llamamos a los servicios/métodos disponibles.
 */

import { EventIngestionService } from "../../src/services/events/EventIngestionService";
import { AbstractEventValidator } from "../../src/validation/AbstractEventValidator";

import { PatternDetectionService } from "../../src/services/events/PatternDetectionService";
import { CoPresenceDetectionService } from "../../src/services/events/CoPresenceDetectionService";
import { WindowProposalService } from "../../src/services/windows/WindowProposalService";
import { WindowDecisionService } from "../../src/services/windows/WindowDecisionService";
import { ActiveWindowService } from "../../src/services/windows/ActiveWindowService";
import { RecognitionService } from "../../src/services/recognition/RecognitionService";
import { RevelationService } from "../../src/services/revelation/RevelationService";

import { EventRepository } from "../../src/repositories/EventRepository";
import { PatternRepository } from "../../src/repositories/PatternRepository";
import { CoPresenceRepository } from "../../src/repositories/CoPresenceRepository";
import { WindowProposalRepository } from "../../src/repositories/WindowProposalRepository";
import { ActiveWindowRepository } from "../../src/repositories/ActiveWindowRepository";
import { RecognitionRepository } from "../../src/repositories/RecognitionRepository";
import { RevelationRepository } from "../../src/repositories/RevelationRepository";
import { ConversationRepository } from "../../src/repositories/ConversationRepository";
import { BlockRepository } from "../../src/repositories/BlockRepository";
import { ReportRepository } from "../../src/repositories/ReportRepository";
import { CooldownRepository } from "../../src/repositories/CooldownRepository";
import { ProposalStateRepository } from "../../src/repositories/ProposalStateRepository";

function log(title: string, obj?: unknown) {
  console.log(`\n=== ${title} ===`);
  if (obj !== undefined) console.dir(obj, { depth: null });
}

function isoWeek(year: number, week: number) {
  return `${year}-W${String(week).padStart(2, "0")}`;
}

async function seedMinimalOverlap(
  ingestion: EventIngestionService,
  A: string,
  B: string
) {
  const weeksA = [1, 2, 3].map(w => isoWeek(2026, w));
  const weeksB = [2, 3, 4].map(w => isoWeek(2026, w));
  for (const w of weeksA) {
    await ingestion.ingest(A, {
      time_bucket: "morning",
      place_category: "cafe",
      day_type: "weekday",
      duration_bucket: "medium",
      week_id: w
    });
  }
  for (const w of weeksB) {
    await ingestion.ingest(B, {
      time_bucket: "morning",
      place_category: "cafe",
      day_type: "weekday",
      duration_bucket: "short",
      week_id: w
    });
  }
}

async function buildServices() {
  const eventRepo = new EventRepository();
  const patternRepo = new PatternRepository();
  const copresenceRepo = new CoPresenceRepository();
  const proposalRepo = new WindowProposalRepository();
  const activeWindowRepo = new ActiveWindowRepository();
  const recognitionRepo = new RecognitionRepository();
  const revelationRepo = new RevelationRepository();
  const conversationRepo = new ConversationRepository();
  const blockRepo = new BlockRepository();
  const reportRepo = new ReportRepository();
  const cooldownRepo = new CooldownRepository();
  const proposalStateRepo = new ProposalStateRepository();

  const ingestion = new EventIngestionService(eventRepo, new AbstractEventValidator());
  const patternDetection = new PatternDetectionService(eventRepo, patternRepo);
  const copresenceDetection = new CoPresenceDetectionService(
    patternRepo,
    eventRepo,
    copresenceRepo,
    blockRepo,
    reportRepo,
    proposalStateRepo
  );

  const proposalService = new WindowProposalService(
    proposalRepo,
    cooldownRepo,
    proposalStateRepo,
    copresenceRepo,
    patternRepo,
    { durationMinutes: 30 }
  );

  const decisionService = new WindowDecisionService(
    proposalRepo,
    cooldownRepo,
    proposalStateRepo,
    copresenceRepo
  );

  const activeWindowService = new ActiveWindowService(activeWindowRepo);

  const revelationService = new RevelationService(
    revelationRepo,
    activeWindowRepo,
    recognitionRepo
  );

  const recognitionService = new RecognitionService(
    activeWindowRepo,
    recognitionRepo,
    revelationService
  );

  return {
    repos: {
      eventRepo, patternRepo, copresenceRepo, proposalRepo, activeWindowRepo,
      recognitionRepo, revelationRepo, conversationRepo, blockRepo, reportRepo,
      cooldownRepo, proposalStateRepo
    },
    services: {
      ingestion, patternDetection, copresenceDetection, proposalService,
      decisionService, activeWindowService, recognitionService
    }
  };
}

async function scenarioDecline() {
  console.log("\n\n######## S1 — DECLINE ########");
  const A = "userA";
  const B = "userB";
  const now = new Date("2026-01-10T10:00:00.000Z");

  const { services, repos } = await buildServices();
  await seedMinimalOverlap(services.ingestion, A, B);

  await services.patternDetection.detectForUsers([A, B]);
  await services.copresenceDetection.detectForUsers([A, B]);

  const proposals = await services.proposalService.generateFromCoPresences(now);
  if (!proposals[0]) throw new Error("S1: no proposal generated");
  const p = proposals[0];

  // A acepta, B declina
  await services.decisionService.accept(p.id, A, now);
  await services.decisionService.decline(p.id, B, now); // si tu método se llama distinto, ajusta aquí

  log("Cooldown B (esperado: 7 días)", await repos.cooldownRepo.getCooldownUntil(B));
  log("Propuesta tras decline", await repos.proposalRepo.findById(p.id));
}

async function scenarioTimeout() {
  console.log("\n\n######## S2 — TIMEOUT (TTL=48h) ########");
  const A = "userA";
  const B = "userB";
  const now = new Date("2026-01-10T10:00:00.000Z");
  const later = new Date(now.getTime() + 49 * 60 * 60 * 1000); // +49h (pasa TTL=48h)

  const { services, repos } = await buildServices();
  await seedMinimalOverlap(services.ingestion, A, B);

  await services.patternDetection.detectForUsers([A, B]);
  await services.copresenceDetection.detectForUsers([A, B]);

  const proposals = await services.proposalService.generateFromCoPresences(now);
  if (!proposals[0]) throw new Error("S2: no proposal generated");
  const p = proposals[0];

  // Nadie responde. Debe expirar sin cooldown.
  // TODO: depende de tu implementación:
  // - si existe decisionService.expireProposals(later)
  // - o proposalRepo.expirePending(later)
  // - o un método equivalente.
  if ((services.decisionService as any).expireProposals) {
    await (services.decisionService as any).expireProposals(later);
  } else {
    // Si no existe, al menos registramos el TODO explícito.
    log("TODO", "No existe método expireProposals(later). Implementar/Exponer para runner sin cron.");
  }

  log("Cooldown A (esperado: null/undefined)", await repos.cooldownRepo.getCooldownUntil(A));
  log("Cooldown B (esperado: null/undefined)", await repos.cooldownRepo.getCooldownUntil(B));
  log("Propuesta tras timeout (esperado: expired/cancelled)", await repos.proposalRepo.findById(p.id));
}

async function scenarioNoMutual() {
  console.log("\n\n######## S3 — NO MUTUAL (TTL=24h) ########");
  const A = "userA";
  const B = "userB";
  const now = new Date("2026-01-10T10:00:00.000Z");

  const { services, repos } = await buildServices();
  await seedMinimalOverlap(services.ingestion, A, B);

  await services.patternDetection.detectForUsers([A, B]);
  await services.copresenceDetection.detectForUsers([A, B]);

  const proposals = await services.proposalService.generateFromCoPresences(now);
  if (!proposals[0]) throw new Error("S3: no proposal generated");
  const p = proposals[0];

  await services.decisionService.accept(p.id, A, now);
  await services.decisionService.accept(p.id, B, now);

  const activatedProposal = await repos.proposalRepo.findById(p.id);
  if (!activatedProposal) throw new Error("S3: proposal not found");

  const activeWindow = await services.activeWindowService.activateFromProposal(activatedProposal, now);
  const within = new Date(activeWindow.start_time.getTime() + 1_000);

  // Solo A confirma, B no.
  await services.recognitionService.confirm(activeWindow.id, A, within);

  // Simulamos +25h para pasar TTL=24h
  const later = new Date(within.getTime() + 25 * 60 * 60 * 1000);

  // TODO: depende de tu implementación de purge/retención:
  if ((repos.recognitionRepo as any).purgeExpired) {
    await (repos.recognitionRepo as any).purgeExpired(later);
  } else if ((services.recognitionService as any).purgeExpired) {
    await (services.recognitionService as any).purgeExpired(later);
  } else {
    log("TODO", "No existe purgeExpired(later). Si el MVP lo maneja por job, exponer método para runner sin cron.");
  }

  log("Recognition records", await (repos.recognitionRepo as any).findAll?.());
  log("Revelations (esperado: ninguna)", await (repos.revelationRepo as any).findAll?.());
}

async function main() {
  await scenarioDecline();
  await scenarioTimeout();
  await scenarioNoMutual();

  console.log("\n✅ OK — Sad paths ejecutados (donde aplique, ver TODOs).");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});