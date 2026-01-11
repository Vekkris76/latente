"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDeletionService = void 0;
class AccountDeletionService {
    constructor(eventRepo, patternRepo, coPresenceRepo, proposalRepo, activeWindowRepo, recognitionRepo, revelationRepo, conversationRepo, cooldownRepo, proposalStateRepo, userRepo) {
        this.eventRepo = eventRepo;
        this.patternRepo = patternRepo;
        this.coPresenceRepo = coPresenceRepo;
        this.proposalRepo = proposalRepo;
        this.activeWindowRepo = activeWindowRepo;
        this.recognitionRepo = recognitionRepo;
        this.revelationRepo = revelationRepo;
        this.conversationRepo = conversationRepo;
        this.cooldownRepo = cooldownRepo;
        this.proposalStateRepo = proposalStateRepo;
        this.userRepo = userRepo;
    }
    async deleteAccount(userId, now) {
        // 1. Borrar datos directos del usuario
        await this.eventRepo.deleteByUserId(userId);
        await this.patternRepo.deleteByUserId(userId);
        await this.cooldownRepo.deleteByUserId(userId);
        await this.proposalStateRepo.deleteByUserId(userId);
        await this.userRepo.deleteByUserId(userId);
        // 2. Borrar datos compartidos/vinculados
        // CoPresences, Proposals, ActiveWindows, Recognitions, Revelations, Conversations
        // Estos repos ya tienen deleteByUserId que filtra si el usuario es A o B
        await this.coPresenceRepo.deleteByUserId(userId);
        await this.proposalRepo.deleteByUserId(userId);
        await this.activeWindowRepo.deleteByUserId(userId);
        await this.recognitionRepo.deleteByUserId(userId);
        await this.revelationRepo.deleteByUserId(userId);
        await this.conversationRepo.deleteByUserId(userId);
        // Nota: BlockRepository y ReportRepository se conservan según reglas (v1)
    }
}
exports.AccountDeletionService = AccountDeletionService;
//# sourceMappingURL=AccountDeletionService.js.map