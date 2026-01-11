import { WindowProposal } from '../../domain/models/WindowProposal';
import { WindowProposalRepository } from '../../infrastructure/repositories/memory/WindowProposalRepository';
import { CooldownRepository } from '../../infrastructure/repositories/memory/CooldownRepository';
import { ProposalStateRepository } from '../../infrastructure/repositories/memory/ProposalStateRepository';
import { CoPresenceRepository } from '../../infrastructure/repositories/memory/CoPresenceRepository';
import { PatternRepository } from '../../infrastructure/repositories/memory/PatternRepository';
import { LatentCoPresence } from '../../domain/models/LatentCoPresence';
import { LatentCoPresenceStatus, TimeBucket, PlaceCategory, DayType } from '../../domain/types/enums';
import { addDays, formatDate, getDayType, getTimeBucketMidpoint, clampTime, addHours } from '../../utils/dateUtils';
import { PROPOSAL_TTL_HOURS } from '../../config/decisions';

export interface WindowProposalConfig {
  durationMinutes: number | null;
}

export class WindowProposalService {
  constructor(
    private proposalRepo: WindowProposalRepository,
    private cooldownRepo: CooldownRepository,
    private proposalStateRepo: ProposalStateRepository,
    private coPresenceRepo: CoPresenceRepository,
    private patternRepo: PatternRepository,
    private config: WindowProposalConfig = { durationMinutes: 30 }
  ) {}

  async generateFromCoPresences(now: Date): Promise<WindowProposal[]> {
    const activeCoPresences = await this.coPresenceRepo.findAll();
    const generatedProposals: WindowProposal[] = [];

    for (const coPresence of activeCoPresences) {
      if (coPresence.status !== LatentCoPresenceStatus.DETECTED) continue;

      const userA = coPresence.user_a_id;
      const userB = coPresence.user_b_id;

      // Regla: si alguno de los dos usuarios tiene propuesta activa => no generar
      if (await this.proposalStateRepo.hasActiveProposal(userA)) continue;
      if (await this.proposalStateRepo.hasActiveProposal(userB)) continue;

      // Regla: si alguno está en cooldown por declinar => no generar
      if (await this.cooldownRepo.isInCooldown(userA, now)) continue;
      if (await this.cooldownRepo.isInCooldown(userB, now)) continue;

      const proposal = await this.createProposal(coPresence, now);
      if (proposal) {
        await this.proposalRepo.save(proposal);
        await this.proposalStateRepo.setActiveProposal(userA, true);
        await this.proposalStateRepo.setActiveProposal(userB, true);
        
        // Actualizar estado de la co-presencia
        coPresence.status = LatentCoPresenceStatus.PROPOSED;
        await this.coPresenceRepo.save(coPresence);

        generatedProposals.push(proposal);
      }
    }

    return generatedProposals;
  }

  private async createProposal(coPresence: LatentCoPresence, now: Date): Promise<WindowProposal | null> {
    const startTime = getTimeBucketMidpoint(coPresence.shared_time_bucket as unknown as TimeBucket);
    if (!startTime) {
      // TODO: midday/night no definidos en doc, no generar propuesta
      return null;
    }

    // Necesitamos el day_type del patrón. Lo sacamos de uno de los patrones de la co-presencia.
    const patternA = await this.patternRepo.findById(coPresence.pattern_id_a);
    if (!patternA) return null;
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

    const clampedStart = clampTime(startTime);
    const [startH, startM] = clampedStart.split(':').map(Number);
    
    const endTotalMinutes = startH * 60 + startM + durationMinutes;
    const endH = Math.floor(endTotalMinutes / 60);
    const endM = endTotalMinutes % 60;
    const endTime = clampTime(`${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`);

    // Buscar un día en los próximos 7 días (mínimo mañana) que coincida con day_type
    let proposedDate: Date | null = null;
    for (let i = 1; i <= 7; i++) {
      const candidateDate = addDays(now, i);
      if (getDayType(candidateDate) === dayType) {
        proposedDate = candidateDate;
        break;
      }
    }

    // Si no se encuentra el mismo day_type (raro en 7 días), usar mañana
    if (!proposedDate) {
      proposedDate = addDays(now, 1);
    }

    const [id1, id2] = [coPresence.user_a_id, coPresence.user_b_id].sort();

    const expiresAt = PROPOSAL_TTL_HOURS !== null ? addHours(now, PROPOSAL_TTL_HOURS) : undefined;

    return {
      id: `prop_${Date.now()}_${id1}_${id2}`,
      coPresenceId: coPresence.copresence_id,
      userA_id: id1,
      userB_id: id2,
      place_category: coPresence.shared_place_category as unknown as PlaceCategory,
      time_bucket: coPresence.shared_time_bucket as unknown as TimeBucket,
      day_type: dayType as unknown as DayType,
      proposed_date: formatDate(proposedDate),
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
