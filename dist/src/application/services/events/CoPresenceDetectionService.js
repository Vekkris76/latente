"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoPresenceDetectionService = void 0;
const enums_1 = require("../../../domain/types/enums");
class CoPresenceDetectionService {
    constructor(patternRepository, eventRepository, copresenceRepository, blockRepository, reportRepository, proposalStateRepository) {
        this.patternRepository = patternRepository;
        this.eventRepository = eventRepository;
        this.copresenceRepository = copresenceRepository;
        this.blockRepository = blockRepository;
        this.reportRepository = reportRepository;
        this.proposalStateRepository = proposalStateRepository;
    }
    async detectForUsers(userIds) {
        const allPatterns = [];
        for (const userId of userIds) {
            const userPatterns = await this.patternRepository.findAllByUser(userId);
            allPatterns.push(...userPatterns);
        }
        const detected = [];
        // Para cada par de usuarios distintos
        for (let i = 0; i < userIds.length; i++) {
            for (let j = i + 1; j < userIds.length; j++) {
                const userA = userIds[i];
                const userB = userIds[j];
                // 4. No bloqueo ni reporte mutuo
                if (await this.blockRepository.existsBetween(userA, userB))
                    continue;
                if (await this.reportRepository.existsBetween(userA, userB))
                    continue;
                // 5. Límites: max 1 propuesta activa por usuario
                if (await this.proposalStateRepository.hasActiveProposal(userA))
                    continue;
                if (await this.proposalStateRepository.hasActiveProposal(userB))
                    continue;
                // 5. Límites: max 2 copresencias por usuario
                const activeA = await this.copresenceRepository.findActiveByUser(userA);
                const activeB = await this.copresenceRepository.findActiveByUser(userB);
                if (activeA.length >= 2 || activeB.length >= 2)
                    continue;
                const patternsA = await this.patternRepository.findAllByUser(userA);
                const patternsB = await this.patternRepository.findAllByUser(userB);
                for (const patA of patternsA) {
                    // Excluir transport
                    if (patA.place_category === 'transport')
                        continue;
                    for (const patB of patternsB) {
                        // 2. Coincidencia exacta en place_category y time_bucket
                        if (patA.place_category === patB.place_category &&
                            patA.time_bucket === patB.time_bucket) {
                            // 3. Solapamiento temporal: al menos 1 week_id en común
                            const eventsA = await this.eventRepository.findAllByUser(userA);
                            const eventsB = await this.eventRepository.findAllByUser(userB);
                            const weeksA = new Set(eventsA
                                .filter((e) => e.place_category === patA.place_category &&
                                e.time_bucket === patA.time_bucket)
                                .map((e) => e.week_id));
                            const weeksB = new Set(eventsB
                                .filter((e) => e.place_category === patB.place_category &&
                                e.time_bucket === patB.time_bucket)
                                .map((e) => e.week_id));
                            const overlap = [...weeksA].filter((w) => weeksB.has(w));
                            if (overlap.length >= 1) {
                                // Evitar duplicados por pareja+key
                                if (await this.copresenceRepository.existsActiveBetween(userA, userB, patA.place_category, patA.time_bucket)) {
                                    continue;
                                }
                                const copresence = {
                                    copresence_id: `cp_${[userA, userB].sort().join('_')}_${patA.place_category}_${patA.time_bucket}`,
                                    user_a_id: userA,
                                    user_b_id: userB,
                                    pattern_id_a: patA.pattern_id,
                                    pattern_id_b: patB.pattern_id,
                                    shared_place_category: patA.place_category,
                                    shared_time_bucket: patA.time_bucket,
                                    overlap_week_ids: overlap,
                                    detected_at: new Date(),
                                    status: enums_1.LatentCoPresenceStatus.DETECTED
                                };
                                await this.copresenceRepository.save(copresence);
                                detected.push(copresence);
                                // Re-verificar límites tras añadir una
                                if ((await this.copresenceRepository.findActiveByUser(userA)).length >= 2)
                                    break;
                            }
                        }
                    }
                    if ((await this.copresenceRepository.findActiveByUser(userA)).length >= 2)
                        break;
                }
            }
        }
        return detected;
    }
}
exports.CoPresenceDetectionService = CoPresenceDetectionService;
//# sourceMappingURL=CoPresenceDetectionService.js.map