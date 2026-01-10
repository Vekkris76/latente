"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevelationService = void 0;
class RevelationService {
    constructor(revelationRepo, activeWindowRepo, recognitionRepo) {
        this.revelationRepo = revelationRepo;
        this.activeWindowRepo = activeWindowRepo;
        this.recognitionRepo = recognitionRepo;
    }
    async createFromActiveWindow(activeWindow, now) {
        const revelation = {
            id: `rev-${activeWindow.id}`,
            user_a_id: activeWindow.user_a_id,
            user_b_id: activeWindow.user_b_id,
            pattern_summary: 'Compartís el gusto por el café los martes por la mañana', // Placeholder legible
            revealed_at: now,
            expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            status: 'active'
        };
        await this.revelationRepo.save(revelation);
        // Marca ActiveWindow como completed
        activeWindow.status = 'completed';
        await this.activeWindowRepo.save(activeWindow);
        // Purga recognitions asociadas
        await this.recognitionRepo.deleteByWindowId(activeWindow.id);
        return revelation;
    }
    async getRevelationForUser(userId, now) {
        const revelations = await this.revelationRepo.findActiveByUser(userId);
        return revelations.filter(r => now < r.expires_at);
    }
}
exports.RevelationService = RevelationService;
//# sourceMappingURL=RevelationService.js.map