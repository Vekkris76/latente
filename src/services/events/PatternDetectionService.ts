import { AbstractEvent } from '../../types/AbstractEvent.types';
import { Pattern } from '../../models/Pattern';
import { EventRepository } from '../../repositories/EventRepository';
import { PatternRepository } from '../../repositories/PatternRepository';
import { PatternStatus } from '../../types/enums';
import { PlaceCategory } from '../../types/catalogs';
import { checkWithin4WeeksSpan, computeSpanWeeks } from '../../utils/weekIdUtils';

export class PatternDetectionService {
  constructor(
    private eventRepository: EventRepository,
    private patternRepository: PatternRepository
  ) {}

  async detectForUser(userId: string): Promise<Pattern[]> {
    const events = await this.eventRepository.findAllByUser(userId);

    // 1. Excluir transport
    const filteredEvents = events.filter(e => e.place_category !== 'transport');

    // 2. Deduplicar por (week_id, day_type, time_bucket, place_category)
    // "Acumulación en un solo día": múltiples eventos en la misma fecha (inferido por day_type + week_id) cuentan como 1 coincidencia.
    const uniqueCoincidences = new Map<string, AbstractEvent>();
    for (const event of filteredEvents) {
      const key = `${event.week_id}|${event.day_type}|${event.time_bucket}|${event.place_category}`;
      if (!uniqueCoincidences.has(key)) {
        uniqueCoincidences.set(key, event);
      }
    }

    const deduplicatedEvents = Array.from(uniqueCoincidences.values());

    // 3. Agrupar por (place_category, time_bucket, day_type)
    const groups = new Map<string, AbstractEvent[]>();
    for (const event of deduplicatedEvents) {
      const key = `${event.place_category}|${event.time_bucket}|${event.day_type}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(event);
    }

    const detectedPatterns: Pattern[] = [];

    for (const [groupKey, groupEvents] of groups.entries()) {
      // Ordenar por week_id para facilitar cálculos
      groupEvents.sort((a, b) => a.week_id.localeCompare(b.week_id));

      // Buscar ventanas de 4 semanas con al menos 3 eventos
      // Como la ventana es pequeña (4 semanas), podemos usar un enfoque de ventana deslizante o fuerza bruta simple
      for (let i = 0; i <= groupEvents.length - 3; i++) {
        let bestJ = -1;
        for (let j = i + 2; j < groupEvents.length; j++) {
          const subset = groupEvents.slice(i, j + 1);
          const weekIds = subset.map(e => e.week_id);
          
          if (checkWithin4WeeksSpan(weekIds)) {
            bestJ = j;
          } else {
            break; // Si ya no cumple el span, no seguirá cumpliendo para j mayores
          }
        }

        if (bestJ !== -1) {
          const subset = groupEvents.slice(i, bestJ + 1);
          const firstEvent = subset[0];
          const lastEvent = subset[subset.length - 1];
          
          const pattern: Pattern = {
            pattern_id: `pat_${userId}_${groupKey.replace(/\|/g, '_')}_${firstEvent.week_id}`,
            user_id: userId,
            place_category: firstEvent.place_category,
            time_bucket: firstEvent.time_bucket,
            day_type: firstEvent.day_type,
            occurrences_count: subset.length,
            first_week_id: firstEvent.week_id,
            last_week_id: lastEvent.week_id,
            pattern_status: PatternStatus.ACTIVE,
            detected_at: new Date()
          };

          detectedPatterns.push(pattern);
          await this.patternRepository.upsertByKey(pattern);
          
          // Avanzamos i hasta después de bestJ para evitar solapamientos excesivos
          // y cumplir con la lógica de que un patrón es una recurrencia estable.
          i = bestJ; 
        }
      }
    }

    return detectedPatterns;
  }
}
