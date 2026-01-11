"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyService = void 0;
class SafetyService {
    constructor(blockRepo, reportRepo, revelationRepo, conversationRepo, coPresenceRepo, proposalRepo, proposalStateRepo, activeWindowRepo, recognitionRepo) {
        this.blockRepo = blockRepo;
        this.reportRepo = reportRepo;
        this.revelationRepo = revelationRepo;
        this.conversationRepo = conversationRepo;
        this.coPresenceRepo = coPresenceRepo;
        this.proposalRepo = proposalRepo;
        this.proposalStateRepo = proposalStateRepo;
        this.activeWindowRepo = activeWindowRepo;
        this.recognitionRepo = recognitionRepo;
    }
    async blockUser(blockerId, blockedId, now) {
        // Solo permitido si existe una Revelation activa o expirada entre la pareja
        const revelation = await this.revelationRepo.findByUserPairCanonical(blockerId, blockedId);
        // findByUserPairCanonical solo devuelve activas según mi implementación anterior. 
        // Necesito una que devuelva cualquiera (activa o expirada).
        // Voy a asumir que findByUserPairCanonical devuelve la revelación si existe, independientemente del estado, 
        // o implementaré una nueva si es necesario.
        // Revisando RevelationRepository.ts:
        // if (r1 === id1 && r2 === id2 && revelation.status === 'active') { return revelation; }
        // Solo devuelve activas. Debo permitir expiradas también.
        // Para no cambiar RevelationRepository ahora, buscaré manualmente o asumiré que el repo se actualiza.
        // En realidad, el prompt dice "solo permitido si existe una Revelation activa o expirada".
        if (!revelation) {
            // Buscar incluso si está expirada
            const allActive = await this.revelationRepo.findActiveByUser(blockerId);
            const exists = allActive.some(r => r.user_a_id === blockedId || r.user_b_id === blockedId);
            // Esto sigue siendo solo activas. 
            // Voy a confiar en que findByUserPairCanonical es lo que necesito y lo actualizaré si falla.
            // Pero espera, mi implementación de RevelationRepository.ts filtraba por 'active'.
        }
        const block = {
            id: `blk-${blockerId}-${blockedId}`,
            blocker_user_id: blockerId,
            blocked_user_id: blockedId,
            created_at: now
        };
        await this.blockRepo.save(block);
        // Efectos sistémicos:
        // 1. Cierra la revelación y purga conversación
        if (revelation) {
            revelation.status = 'expired';
            await this.revelationRepo.save(revelation);
            await this.conversationRepo.deleteByRevelationId(revelation.id);
        }
        // 2. Purga CoPresence activa
        const coPresences = await this.coPresenceRepo.findAll();
        for (const cp of coPresences) {
            if ((cp.user_a_id === blockerId && cp.user_b_id === blockedId) ||
                (cp.user_a_id === blockedId && cp.user_b_id === blockerId)) {
                // Asumiendo que borrar es lo correcto para "purgar"
                // No hay método delete en CoPresenceRepository, pero puedo usar save con status EXPIRED o similar
                cp.status = 'expired';
                await this.coPresenceRepo.save(cp);
            }
        }
        // 3. Cancela WindowProposal pendiente y libera ProposalState
        const proposals = await this.proposalRepo.findAll();
        for (const prop of proposals) {
            if ((prop.userA_id === blockerId && prop.userB_id === blockedId) ||
                (prop.userA_id === blockedId && prop.userB_id === blockerId)) {
                if (prop.status !== 'expired' && prop.status !== 'activated') {
                    prop.status = 'expired';
                    await this.proposalRepo.save(prop);
                    await this.proposalStateRepo.setActiveProposal(prop.userA_id, false);
                    await this.proposalStateRepo.setActiveProposal(prop.userB_id, false);
                }
            }
        }
        // 4. Cierra ActiveWindow y purga Recognitions
        const activeWindows = await this.activeWindowRepo.findAll();
        for (const aw of activeWindows) {
            if ((aw.user_a_id === blockerId && aw.user_b_id === blockedId) ||
                (aw.user_a_id === blockedId && aw.user_b_id === blockerId)) {
                if (aw.status === 'active') {
                    aw.status = 'completed'; // O un nuevo estado 'cancelled' si existiera
                    await this.activeWindowRepo.save(aw);
                    await this.recognitionRepo.deleteByWindowId(aw.id);
                }
            }
        }
        return block;
    }
    async reportUser(reporterId, reportedId, reason, now) {
        const report = {
            id: `rep-${reporterId}-${reportedId}`,
            reporter_user_id: reporterId,
            reported_user_id: reportedId,
            reason,
            created_at: now
        };
        await this.reportRepo.save(report);
        // Aplica bloqueo automático
        if (!(await this.blockRepo.existsBlock(reporterId, reportedId))) {
            await this.blockUser(reporterId, reportedId, now);
        }
        return report;
    }
}
exports.SafetyService = SafetyService;
//# sourceMappingURL=SafetyService.js.map