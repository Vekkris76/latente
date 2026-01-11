"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecognitionService = void 0;
class RecognitionService {
    constructor(activeWindowRepo, recognitionRepo, revelationService) {
        this.activeWindowRepo = activeWindowRepo;
        this.recognitionRepo = recognitionRepo;
        this.revelationService = revelationService;
    }
    async confirm(activeWindowId, userId, now) {
        const window = await this.activeWindowRepo.findById(activeWindowId);
        if (!window) {
            throw new Error('Active window not found');
        }
        if (window.status !== 'active') {
            throw new Error('Window is not active');
        }
        if (now < window.start_time || now > window.end_time) {
            throw new Error('Outside of active window time');
        }
        const existing = await this.recognitionRepo.findByWindowAndUser(activeWindowId, userId);
        if (existing) {
            throw new Error('User already confirmed for this window');
        }
        const recognition = {
            id: `rec-${activeWindowId}-${userId}`,
            active_window_id: activeWindowId,
            user_id: userId,
            created_at: now,
            status: 'confirmed'
        };
        await this.recognitionRepo.save(recognition);
        // Evaluar mutualidad
        const allRecognitions = await this.recognitionRepo.findByWindow(activeWindowId);
        const confirmedUsers = allRecognitions.map(r => r.user_id);
        if (confirmedUsers.includes(window.user_a_id) && confirmedUsers.includes(window.user_b_id)) {
            // Disparar revelación inmediata
            await this.revelationService.createFromActiveWindow(window, now);
        }
        return recognition;
    }
}
exports.RecognitionService = RecognitionService;
//# sourceMappingURL=RecognitionService.js.map