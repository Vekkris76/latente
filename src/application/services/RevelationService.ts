import { ActiveWindow } from '../../domain/models/ActiveWindow';
import { Revelation } from '../../domain/models/Revelation';
import { ActiveWindowRepository } from '../../infrastructure/persistence/memory/ActiveWindowRepository';
import { RecognitionRepository } from '../../infrastructure/persistence/memory/RecognitionRepository';
import { RevelationRepository } from '../../infrastructure/persistence/memory/RevelationRepository';

export class RevelationService {
  constructor(
    private revelationRepo: RevelationRepository,
    private activeWindowRepo: ActiveWindowRepository,
    private recognitionRepo: RecognitionRepository
  ) {}

  async createFromActiveWindow(activeWindow: ActiveWindow, now: Date): Promise<Revelation> {
    const revelation: Revelation = {
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

  async getRevelationForUser(userId: string, now: Date): Promise<Revelation[]> {
    const revelations = await this.revelationRepo.findActiveByUser(userId);
    return revelations.filter(r => now < r.expires_at);
  }
}
