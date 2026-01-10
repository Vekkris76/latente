"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurgeService = void 0;
class PurgeService {
    constructor(recognitionRepo, revelationRepo, conversationRepo) {
        this.recognitionRepo = recognitionRepo;
        this.revelationRepo = revelationRepo;
        this.conversationRepo = conversationRepo;
    }
    async purgeNonMutualRecognitions(now) {
        return await this.recognitionRepo.purgeExpired(now);
    }
    async purgeExpiredRevelations(now) {
        const expiredIds = await this.revelationRepo.purgeExpired(now);
        for (const id of expiredIds) {
            await this.conversationRepo.deleteByRevelationId(id);
        }
        return expiredIds.length;
    }
}
exports.PurgeService = PurgeService;
//# sourceMappingURL=PurgeService.js.map