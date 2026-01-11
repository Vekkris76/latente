import { AbstractEventInput } from "../../src/domain/types/AbstractEvent.types";

import { AbstractEventValidator } from "../../src/domain/validation/AbstractEventValidator";

import { EventRepository } from "../../src/infrastructure/persistence/memory/EventRepository";
import { PatternRepository } from "../../src/infrastructure/persistence/memory/PatternRepository";
import { CoPresenceRepository } from "../../src/infrastructure/persistence/memory/CoPresenceRepository";
import { WindowProposalRepository } from "../../src/infrastructure/persistence/memory/WindowProposalRepository";
import { ActiveWindowRepository } from "../../src/infrastructure/persistence/memory/ActiveWindowRepository";
import { RecognitionRepository } from "../../src/infrastructure/persistence/memory/RecognitionRepository";
import { RevelationRepository } from "../../src/infrastructure/persistence/memory/RevelationRepository";
import { BlockRepository } from "../../src/infrastructure/persistence/memory/BlockRepository";
import { ReportRepository } from "../../src/infrastructure/persistence/memory/ReportRepository";
import { CooldownRepository } from "../../src/infrastructure/persistence/memory/CooldownRepository";
import { ProposalStateRepository } from "../../src/infrastructure/persistence/memory/ProposalStateRepository";

import { EventIngestionService } from "../../src/application/services/events/EventIngestionService";
import { PatternDetectionService } from "../../src/application/services/events/PatternDetectionService";
import { CoPresenceDetectionService } from "../../src/application/services/events/CoPresenceDetectionService";
import { WindowProposalService } from "../../src/application/services/WindowProposalService";
import { WindowDecisionService } from "../../src/application/services/WindowDecisionService";
import { ActiveWindowService } from "../../src/application/services/ActiveWindowService";
import { RecognitionService } from "../../src/application/services/RecognitionService";
import { RevelationService } from "../../src/application/services/RevelationService";
import { SafetyService } from "../../src/application/services/SafetyService";
import { AccountDeletionService } from "../../src/application/services/AccountDeletionService";

export type Adapter = ReturnType<typeof createAdapter>;

export function createAdapter() {
  // Repos
  const eventRepo = new EventRepository();
  const patternRepo = new PatternRepository();
  const copresenceRepo = new CoPresenceRepository();

  const proposalRepo = new WindowProposalRepository();
  const activeWindowRepo = new ActiveWindowRepository();
  const recognitionRepo = new RecognitionRepository();
  const revelationRepo = new RevelationRepository();

  const blockRepo = new BlockRepository();
  const reportRepo = new ReportRepository();
  const cooldownRepo = new CooldownRepository();
  const proposalStateRepo = new ProposalStateRepository();

  // Servicios
  const validator = new AbstractEventValidator();
  const ingestion = new EventIngestionService(eventRepo, validator);

  // OJO: si tu constructor es (eventRepo, patternRepo) o (patternRepo, eventRepo),
  // ajusta aquí UNA vez.
  const patternDetection = new PatternDetectionService(eventRepo as any, patternRepo as any);

  const copresenceDetection = new CoPresenceDetectionService(
    patternRepo as any,
    eventRepo as any,
    copresenceRepo as any,
    blockRepo as any,
    reportRepo as any,
    proposalStateRepo as any
  );

  const proposalService = new WindowProposalService(
    proposalRepo as any,
    cooldownRepo as any,
    proposalStateRepo as any,
    copresenceRepo as any,
    patternRepo as any,
    { durationMinutes: 30 }
  );

  const decisionService = new WindowDecisionService(
    proposalRepo as any,
    cooldownRepo as any,
    proposalStateRepo as any,
    copresenceRepo as any
  );

  const activeWindowService = new ActiveWindowService(activeWindowRepo as any);

  const revelationService = new RevelationService(
    revelationRepo as any,
    activeWindowRepo as any,
    recognitionRepo as any
  );

  // Basado en tu wiring que ya compila: (activeWindowRepo, recognitionRepo, revelationService)
  const recognitionService = new RecognitionService(
    activeWindowRepo as any,
    recognitionRepo as any,
    revelationService as any
  );

  // Safety + Deletion (para flujos)
  // Cast a `any` para evitar problemas de aridad/firma si el servicio cambia.
  const SafetyServiceAny = SafetyService as any;
  const safetyService = new SafetyServiceAny(
    blockRepo as any,
    reportRepo as any,
    revelationRepo as any,
    copresenceRepo as any,
    proposalRepo as any,
    proposalStateRepo as any,
    activeWindowRepo as any,
    recognitionRepo as any
  );

  const AccountDeletionServiceAny = AccountDeletionService as any;
  const accountDeletionService = new AccountDeletionServiceAny(
    eventRepo as any,
    patternRepo as any,
    copresenceRepo as any,
    proposalRepo as any,
    activeWindowRepo as any,
    recognitionRepo as any,
    revelationRepo as any,
    cooldownRepo as any,
    proposalStateRepo as any,
    blockRepo as any,
    reportRepo as any
  );

  // Helpers de lectura (no obligatorios)
  async function listEventsByUser(userId: string) {
    const fn = (eventRepo as any).findAllByUser;
    return fn ? await fn.call(eventRepo, userId) : [];
  }

  async function listPatternsByUser(userId: string) {
    const fn = (patternRepo as any).findByUserId;
    return fn ? await fn.call(patternRepo, userId) : [];
  }

  async function listCoPresences() {
    const fn = (copresenceRepo as any).findAll;
    return fn ? await fn.call(copresenceRepo) : [];
  }

  async function listProposals() {
    const fn = (proposalRepo as any).findAll;
    return fn ? await fn.call(proposalRepo) : [];
  }

  async function listActiveWindows() {
    const fn = (activeWindowRepo as any).findAll;
    return fn ? await fn.call(activeWindowRepo) : [];
  }

  async function listRevelationsByUser(userId: string, now: Date) {
    return await revelationService.getRevelationForUser(userId, now);
  }

  return {
    // Core operations
    ingestEvent: async (userId: string, input: AbstractEventInput) => ingestion.ingest(userId, input),
    detectPatterns: async (userId: string) => patternDetection.detectForUser(userId),
    detectCoPresences: async (userIds: string[]) => copresenceDetection.detectForUsers(userIds),
    generateProposals: async (now: Date) => proposalService.generateFromCoPresences(now),
    acceptProposal: async (proposalId: string, userId: string, now: Date) =>
      decisionService.accept(proposalId, userId, now),
    declineProposal: async (proposalId: string, userId: string, now: Date) =>
      decisionService.decline(proposalId, userId, now),
    expireProposals: async (now: Date) => decisionService.expireProposals(now),
    activateFromProposal: async (proposalId: string, now: Date) => {
      const proposal = await (proposalRepo as any).findById(proposalId);
      if (!proposal) throw new Error("Proposal no encontrada");
      return activeWindowService.activateFromProposal(proposal, now);
    },
    getActiveWindowForUser: async (userId: string, now: Date) =>
      activeWindowService.getActiveWindowForUser(userId, now),
    confirmRecognition: async (activeWindowId: string, userId: string, now: Date) =>
      recognitionService.confirm(activeWindowId, userId, now),
    getRevelations: async (userId: string, now: Date) => listRevelationsByUser(userId, now),

    // Safety & deletion
    block: async (userId: string, otherUserId: string, now: Date) =>
      (safetyService as any).block(userId, otherUserId, now),
    report: async (
      userId: string,
      otherUserId: string,
      reason: string,
      text: string | undefined,
      now: Date
    ) => (safetyService as any).report(userId, otherUserId, reason, text, now),
    deleteAccount: async (userId: string, now: Date) =>
      (accountDeletionService as any).deleteAccount(userId, now),

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