"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdapter = createAdapter;
const AbstractEventValidator_1 = require("../../src/domain/validation/AbstractEventValidator");
const EventRepository_1 = require("../../src/infrastructure/persistence/memory/EventRepository");
const PatternRepository_1 = require("../../src/infrastructure/persistence/memory/PatternRepository");
const CoPresenceRepository_1 = require("../../src/infrastructure/persistence/memory/CoPresenceRepository");
const WindowProposalRepository_1 = require("../../src/infrastructure/persistence/memory/WindowProposalRepository");
const ActiveWindowRepository_1 = require("../../src/infrastructure/persistence/memory/ActiveWindowRepository");
const RecognitionRepository_1 = require("../../src/infrastructure/persistence/memory/RecognitionRepository");
const RevelationRepository_1 = require("../../src/infrastructure/persistence/memory/RevelationRepository");
const BlockRepository_1 = require("../../src/infrastructure/persistence/memory/BlockRepository");
const ReportRepository_1 = require("../../src/infrastructure/persistence/memory/ReportRepository");
const CooldownRepository_1 = require("../../src/infrastructure/persistence/memory/CooldownRepository");
const ProposalStateRepository_1 = require("../../src/infrastructure/persistence/memory/ProposalStateRepository");
const EventIngestionService_1 = require("../../src/application/services/events/EventIngestionService");
const PatternDetectionService_1 = require("../../src/application/services/events/PatternDetectionService");
const CoPresenceDetectionService_1 = require("../../src/application/services/events/CoPresenceDetectionService");
const WindowProposalService_1 = require("../../src/application/services/WindowProposalService");
const WindowDecisionService_1 = require("../../src/application/services/WindowDecisionService");
const ActiveWindowService_1 = require("../../src/application/services/ActiveWindowService");
const RecognitionService_1 = require("../../src/application/services/RecognitionService");
const RevelationService_1 = require("../../src/application/services/RevelationService");
const SafetyService_1 = require("../../src/application/services/SafetyService");
const AccountDeletionService_1 = require("../../src/application/services/AccountDeletionService");
function createAdapter() {
    // Repos
    const eventRepo = new EventRepository_1.EventRepository();
    const patternRepo = new PatternRepository_1.PatternRepository();
    const copresenceRepo = new CoPresenceRepository_1.CoPresenceRepository();
    const proposalRepo = new WindowProposalRepository_1.WindowProposalRepository();
    const activeWindowRepo = new ActiveWindowRepository_1.ActiveWindowRepository();
    const recognitionRepo = new RecognitionRepository_1.RecognitionRepository();
    const revelationRepo = new RevelationRepository_1.RevelationRepository();
    const blockRepo = new BlockRepository_1.BlockRepository();
    const reportRepo = new ReportRepository_1.ReportRepository();
    const cooldownRepo = new CooldownRepository_1.CooldownRepository();
    const proposalStateRepo = new ProposalStateRepository_1.ProposalStateRepository();
    // Servicios
    const validator = new AbstractEventValidator_1.AbstractEventValidator();
    const ingestion = new EventIngestionService_1.EventIngestionService(eventRepo, validator);
    // OJO: si tu constructor es (eventRepo, patternRepo) o (patternRepo, eventRepo),
    // ajusta aquí UNA vez.
    const patternDetection = new PatternDetectionService_1.PatternDetectionService(eventRepo, patternRepo);
    const copresenceDetection = new CoPresenceDetectionService_1.CoPresenceDetectionService(patternRepo, eventRepo, copresenceRepo, blockRepo, reportRepo, proposalStateRepo);
    const proposalService = new WindowProposalService_1.WindowProposalService(proposalRepo, cooldownRepo, proposalStateRepo, copresenceRepo, patternRepo, { durationMinutes: 30 });
    const decisionService = new WindowDecisionService_1.WindowDecisionService(proposalRepo, cooldownRepo, proposalStateRepo, copresenceRepo);
    const activeWindowService = new ActiveWindowService_1.ActiveWindowService(activeWindowRepo);
    const revelationService = new RevelationService_1.RevelationService(revelationRepo, activeWindowRepo, recognitionRepo);
    // Basado en tu wiring que ya compila: (activeWindowRepo, recognitionRepo, revelationService)
    const recognitionService = new RecognitionService_1.RecognitionService(activeWindowRepo, recognitionRepo, revelationService);
    // Safety + Deletion (para flujos)
    // Cast a `any` para evitar problemas de aridad/firma si el servicio cambia.
    const SafetyServiceAny = SafetyService_1.SafetyService;
    const safetyService = new SafetyServiceAny(blockRepo, reportRepo, revelationRepo, copresenceRepo, proposalRepo, proposalStateRepo, activeWindowRepo, recognitionRepo);
    const AccountDeletionServiceAny = AccountDeletionService_1.AccountDeletionService;
    const accountDeletionService = new AccountDeletionServiceAny(eventRepo, patternRepo, copresenceRepo, proposalRepo, activeWindowRepo, recognitionRepo, revelationRepo, cooldownRepo, proposalStateRepo, blockRepo, reportRepo);
    // Helpers de lectura (no obligatorios)
    async function listEventsByUser(userId) {
        const fn = eventRepo.findAllByUser;
        return fn ? await fn.call(eventRepo, userId) : [];
    }
    async function listPatternsByUser(userId) {
        const fn = patternRepo.findByUserId;
        return fn ? await fn.call(patternRepo, userId) : [];
    }
    async function listCoPresences() {
        const fn = copresenceRepo.findAll;
        return fn ? await fn.call(copresenceRepo) : [];
    }
    async function listProposals() {
        const fn = proposalRepo.findAll;
        return fn ? await fn.call(proposalRepo) : [];
    }
    async function listActiveWindows() {
        const fn = activeWindowRepo.findAll;
        return fn ? await fn.call(activeWindowRepo) : [];
    }
    async function listRevelationsByUser(userId, now) {
        return await revelationService.getRevelationForUser(userId, now);
    }
    return {
        // Core operations
        ingestEvent: async (userId, input) => ingestion.ingest(userId, input),
        detectPatterns: async (userId) => patternDetection.detectForUser(userId),
        detectCoPresences: async (userIds) => copresenceDetection.detectForUsers(userIds),
        generateProposals: async (now) => proposalService.generateFromCoPresences(now),
        acceptProposal: async (proposalId, userId, now) => decisionService.accept(proposalId, userId, now),
        declineProposal: async (proposalId, userId, now) => decisionService.decline(proposalId, userId, now),
        expireProposals: async (now) => decisionService.expireProposals(now),
        activateFromProposal: async (proposalId, now) => {
            const proposal = await proposalRepo.findById(proposalId);
            if (!proposal)
                throw new Error("Proposal no encontrada");
            return activeWindowService.activateFromProposal(proposal, now);
        },
        getActiveWindowForUser: async (userId, now) => activeWindowService.getActiveWindowForUser(userId, now),
        confirmRecognition: async (activeWindowId, userId, now) => recognitionService.confirm(activeWindowId, userId, now),
        getRevelations: async (userId, now) => listRevelationsByUser(userId, now),
        // Safety & deletion
        block: async (userId, otherUserId, now) => safetyService.block(userId, otherUserId, now),
        report: async (userId, otherUserId, reason, text, now) => safetyService.report(userId, otherUserId, reason, text, now),
        deleteAccount: async (userId, now) => accountDeletionService.deleteAccount(userId, now),
        // Debug reads
        listEventsByUser,
        listPatternsByUser,
        listCoPresences,
        listProposals,
        listActiveWindows,
        // Expose repos ids helper if needed
        _repos: {
            proposalRepo,
            activeWindowRepo,
        },
    };
}
//# sourceMappingURL=adapter.js.map