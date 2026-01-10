export class CooldownRepository {
  private cooldowns: Map<string, Date> = new Map();

  async setCooldownUntil(userId: string, date: Date | string): Promise<void> {
    const cooldownDate = typeof date === 'string' ? new Date(date) : date;
    this.cooldowns.set(userId, cooldownDate);
  }

  async isInCooldown(userId: string, now: Date): Promise<boolean> {
    const cooldownUntil = this.cooldowns.get(userId);
    if (!cooldownUntil) return false;
    return now < cooldownUntil;
  }

  async getCooldownUntil(userId: string): Promise<Date | null> {
    return this.cooldowns.get(userId) || null;
  }
}
