import { Pattern } from '../../../domain/models/Pattern';
import { IRepository } from '../../../domain/repositories/IRepository';

export class PatternRepository implements IRepository<Pattern> {
  private patterns: Pattern[] = [];

  async save(pattern: Pattern): Promise<Pattern> {
    const index = this.patterns.findIndex(p => p.pattern_id === pattern.pattern_id);
    if (index >= 0) {
      this.patterns[index] = pattern;
    } else {
      this.patterns.push(pattern);
    }
    return pattern;
  }

  async findById(id: string): Promise<Pattern | null> {
    return this.patterns.find(p => p.pattern_id === id) || null;
  }

  async findAllByUser(userId: string): Promise<Pattern[]> {
    return this.patterns.filter(p => p.user_id === userId);
  }

  async deleteByUserId(userId: string): Promise<void> {
    this.patterns = this.patterns.filter(p => p.user_id !== userId);
  }

  async upsertByKey(pattern: Pattern): Promise<Pattern> {
    const index = this.patterns.findIndex(p => 
      p.user_id === pattern.user_id &&
      p.place_category === pattern.place_category &&
      p.time_bucket === pattern.time_bucket &&
      p.day_type === pattern.day_type
    );

    if (index >= 0) {
      this.patterns[index] = pattern;
    } else {
      this.patterns.push(pattern);
    }
    return pattern;
  }

  // Para tests
  async clear(): Promise<void> {
    this.patterns = [];
  }
}
