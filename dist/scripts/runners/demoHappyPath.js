"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const EventIngestionService_1 = require("../../src/application/services/events/EventIngestionService");
const AbstractEventValidator_1 = require("../../src/domain/validation/AbstractEventValidator");
const PatternDetectionService_1 = require("../../src/application/services/events/PatternDetectionService");
const CoPresenceDetectionService_1 = require("../../src/application/services/events/CoPresenceDetectionService");
const WindowProposalService_1 = require("../../src/application/services/WindowProposalService");
const WindowDecisionService_1 = require("../../src/application/services/WindowDecisionService");
const ActiveWindowService_1 = require("../../src/application/services/ActiveWindowService");
const RecognitionService_1 = require("../../src/application/services/RecognitionService");
const RevelationService_1 = require("../../src/application/services/RevelationService");
const EventRepository_1 = require("../../src/infrastructure/persistence/memory/EventRepository");
const PatternRepository_1 = require("../../src/infrastructure/persistence/memory/PatternRepository");
const CoPresenceRepository_1 = require("../../src/infrastructure/persistence/memory/CoPresenceRepository");
const WindowProposalRepository_1 = require("../../src/infrastructure/persistence/memory/WindowProposalRepository");
const ActiveWindowRepository_1 = require("../../src/infrastructure/persistence/memory/ActiveWindowRepository");
const RecognitionRepository_1 = require("../../src/infrastructure/persistence/memory/RecognitionRepository");
const RevelationRepository_1 = require("../../src/infrastructure/persistence/memory/RevelationRepository");
const ConversationRepository_1 = require("../../src/infrastructure/persistence/memory/ConversationRepository");
const BlockRepository_1 = require("../../src/infrastructure/persistence/memory/BlockRepository");
const ReportRepository_1 = require("../../src/infrastructure/persistence/memory/ReportRepository");
const CooldownRepository_1 = require("../../src/infrastructure/persistence/memory/CooldownRepository");
const ProposalStateRepository_1 = require("../../src/infrastructure/persistence/memory/ProposalStateRepository");
function log(title, obj) {
    console.log(`\n=== ${title} ===`);
    if (obj !== undefined)
        console.dir(obj, { depth: null });
}
function isoWeek(year, week) {
    return `${year}-W${String(week).padStart(2, "0")}`;
}
async function seedMinimalOverlap(ingestion, A, B) {
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
    const eventRepo = new EventRepository_1.EventRepository();
    const patternRepo = new PatternRepository_1.PatternRepository();
    const copresenceRepo = new CoPresenceRepository_1.CoPresenceRepository();
    const proposalRepo = new WindowProposalRepository_1.WindowProposalRepository();
    const activeWindowRepo = new ActiveWindowRepository_1.ActiveWindowRepository();
    const recognitionRepo = new RecognitionRepository_1.RecognitionRepository();
    const revelationRepo = new RevelationRepository_1.RevelationRepository();
    const conversationRepo = new ConversationRepository_1.ConversationRepository();
    const blockRepo = new BlockRepository_1.BlockRepository();
    const reportRepo = new ReportRepository_1.ReportRepository();
    const cooldownRepo = new CooldownRepository_1.CooldownRepository();
    const proposalStateRepo = new ProposalStateRepository_1.ProposalStateRepository();
    const ingestion = new EventIngestionService_1.EventIngestionService(eventRepo, new AbstractEventValidator_1.AbstractEventValidator());
    const patternDetection = new PatternDetectionService_1.PatternDetectionService(eventRepo, patternRepo);
    const copresenceDetection = new CoPresenceDetectionService_1.CoPresenceDetectionService(patternRepo, eventRepo, copresenceRepo, blockRepo, reportRepo, proposalStateRepo);
    const proposalService = new WindowProposalService_1.WindowProposalService(proposalRepo, cooldownRepo, proposalStateRepo, copresenceRepo, patternRepo, { durationMinutes: 30 });
    const decisionService = new WindowDecisionService_1.WindowDecisionService(proposalRepo, cooldownRepo, proposalStateRepo, copresenceRepo);
    const activeWindowService = new ActiveWindowService_1.ActiveWindowService(activeWindowRepo);
    const revelationService = new RevelationService_1.RevelationService(revelationRepo, activeWindowRepo, recognitionRepo);
    const recognitionService = new RecognitionService_1.RecognitionService(activeWindowRepo, recognitionRepo, revelationService);
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
    await services.patternDetection.detectForUser(A);
    await services.patternDetection.detectForUser(B);
    await services.copresenceDetection.detectForUsers([A, B]);
    const proposals = await services.proposalService.generateFromCoPresences(now);
    if (!proposals[0])
        throw new Error("S1: no proposal generated");
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
    await services.patternDetection.detectForUser(A);
    await services.patternDetection.detectForUser(B);
    await services.copresenceDetection.detectForUsers([A, B]);
    const proposals = await services.proposalService.generateFromCoPresences(now);
    if (!proposals[0])
        throw new Error("S2: no proposal generated");
    const p = proposals[0];
    // Nadie responde. Debe expirar sin cooldown.
    // TODO: depende de tu implementación:
    // - si existe decisionService.expireProposals(later)
    // - o proposalRepo.expirePending(later)
    // - o un método equivalente.
    if (services.decisionService.expireProposals) {
        await services.decisionService.expireProposals(later);
    }
    else {
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
    await services.patternDetection.detectForUser(A);
    await services.patternDetection.detectForUser(B);
    await services.copresenceDetection.detectForUsers([A, B]);
    const proposals = await services.proposalService.generateFromCoPresences(now);
    if (!proposals[0])
        throw new Error("S3: no proposal generated");
    const p = proposals[0];
    await services.decisionService.accept(p.id, A, now);
    await services.decisionService.accept(p.id, B, now);
    const activatedProposal = await repos.proposalRepo.findById(p.id);
    if (!activatedProposal)
        throw new Error("S3: proposal not found");
    const activeWindow = await services.activeWindowService.activateFromProposal(activatedProposal, now);
    const within = new Date(activeWindow.start_time.getTime() + 1000);
    // Solo A confirma, B no.
    await services.recognitionService.confirm(activeWindow.id, A, within);
    // Simulamos +25h para pasar TTL=24h
    const later = new Date(within.getTime() + 25 * 60 * 60 * 1000);
    // TODO: depende de tu implementación de purge/retención:
    if (repos.recognitionRepo.purgeExpired) {
        await repos.recognitionRepo.purgeExpired(later);
    }
    else if (services.recognitionService.purgeExpired) {
        await services.recognitionService.purgeExpired(later);
    }
    else {
        log("TODO", "No existe purgeExpired(later). Si el MVP lo maneja por job, exponer método para runner sin cron.");
    }
    log("Recognition records", await repos.recognitionRepo.findAll?.());
    log("Revelations (esperado: ninguna)", await repos.revelationRepo.findAll?.());
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
//# sourceMappingURL=demoHappyPath.js.map