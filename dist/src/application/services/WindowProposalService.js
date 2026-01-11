"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowProposalService = void 0;
const enums_1 = require("../../domain/types/enums");
const dateUtils_1 = require("../../infrastructure/utils/dateUtils");
const decisions_1 = require("../../infrastructure/config/decisions");
class WindowProposalService {
    constructor(proposalRepo, cooldownRepo, proposalStateRepo, coPresenceRepo, patternRepo, config = { durationMinutes: 30 }) {
        this.proposalRepo = proposalRepo;
        this.cooldownRepo = cooldownRepo;
        this.proposalStateRepo = proposalStateRepo;
        this.coPresenceRepo = coPresenceRepo;
        this.patternRepo = patternRepo;
        this.config = config;
    }
    async generateFromCoPresences(now) {
        const activeCoPresences = await this.coPresenceRepo.findAll();
        const generatedProposals = [];
        for (const coPresence of activeCoPresences) {
            if (coPresence.status !== enums_1.LatentCoPresenceStatus.DETECTED)
                continue;
            const userA = coPresence.user_a_id;
            const userB = coPresence.user_b_id;
            // Regla: si alguno de los dos usuarios tiene propuesta activa => no generar
            if (await this.proposalStateRepo.hasActiveProposal(userA))
                continue;
            if (await this.proposalStateRepo.hasActiveProposal(userB))
                continue;
            // Regla: si alguno está en cooldown por declinar => no generar
            if (await this.cooldownRepo.isInCooldown(userA, now))
                continue;
            if (await this.cooldownRepo.isInCooldown(userB, now))
                continue;
            const proposal = await this.createProposal(coPresence, now);
            if (proposal) {
                await this.proposalRepo.save(proposal);
                await this.proposalStateRepo.setActiveProposal(userA, true);
                await this.proposalStateRepo.setActiveProposal(userB, true);
                // Actualizar estado de la co-presencia
                coPresence.status = enums_1.LatentCoPresenceStatus.PROPOSED;
                await this.coPresenceRepo.save(coPresence);
                generatedProposals.push(proposal);
            }
        }
        return generatedProposals;
    }
    async createProposal(coPresence, now) {
        const startTime = (0, dateUtils_1.getTimeBucketMidpoint)(coPresence.shared_time_bucket);
        if (!startTime) {
            // TODO: midday/night no definidos en doc, no generar propuesta
            return null;
        }
        // Necesitamos el day_type del patrón. Lo sacamos de uno de los patrones de la co-presencia.
        const patternA = await this.patternRepo.findById(coPresence.pattern_id_a);
        if (!patternA)
            return null;
        const dayType = patternA.day_type;
        // Duración: debe venir de DECISIONES_V1 (30-45 min). 
        // TODO: Si DECISIONES_V1 no define duración exacta, no generar propuesta.
        // Como DECISIONES_V1 dice "entre 30 y 45 minutos" pero no fija uno, 
        // según el feedback debemos devolver error TODO o resultado vacío.
        // Para cumplir con el feedback, usamos la configuración inyectada.
        // Si durationMinutes es null (no definido en DECISIONES_V1), no generamos propuesta.
        const durationMinutes = this.config.durationMinutes;
        if (durationMinutes === null) {
            console.log(`TODO: Duración no definida en DECISIONES_V1 para co-presencia ${coPresence.copresence_id}`);
            return null;
        }
        const clampedStart = (0, dateUtils_1.clampTime)(startTime);
        const [startH, startM] = clampedStart.split(':').map(Number);
        const endTotalMinutes = startH * 60 + startM + durationMinutes;
        const endH = Math.floor(endTotalMinutes / 60);
        const endM = endTotalMinutes % 60;
        const endTime = (0, dateUtils_1.clampTime)(`${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`);
        // Buscar un día en los próximos 7 días (mínimo mañana) que coincida con day_type
        let proposedDate = null;
        for (let i = 1; i <= 7; i++) {
            const candidateDate = (0, dateUtils_1.addDays)(now, i);
            if ((0, dateUtils_1.getDayType)(candidateDate) === dayType) {
                proposedDate = candidateDate;
                break;
            }
        }
        // Si no se encuentra el mismo day_type (raro en 7 días), usar mañana
        if (!proposedDate) {
            proposedDate = (0, dateUtils_1.addDays)(now, 1);
        }
        const [id1, id2] = [coPresence.user_a_id, coPresence.user_b_id].sort();
        const expiresAt = decisions_1.PROPOSAL_TTL_HOURS !== null ? (0, dateUtils_1.addHours)(now, decisions_1.PROPOSAL_TTL_HOURS) : undefined;
        return {
            id: `prop_${Date.now()}_${id1}_${id2}`,
            coPresenceId: coPresence.copresence_id,
            userA_id: id1,
            userB_id: id2,
            place_category: coPresence.shared_place_category,
            time_bucket: coPresence.shared_time_bucket,
            day_type: dayType,
            proposed_date: (0, dateUtils_1.formatDate)(proposedDate),
            start_time: clampedStart,
            end_time: endTime,
            status: 'pending',
            acceptA: false,
            acceptB: false,
            declined_by: null,
            created_at: now,
            expires_at: expiresAt,
        };
    }
}
exports.WindowProposalService = WindowProposalService;
//# sourceMappingURL=WindowProposalService.js.map