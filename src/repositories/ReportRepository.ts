export class ReportRepository {
  private reports: Set<string> = new Set();

  private getKey(userA: string, userB: string): string {
    const [min, max] = [userA, userB].sort();
    return `${min}:${max}`;
  }

  async saveReport(userA: string, userB: string): Promise<void> {
    this.reports.add(this.getKey(userA, userB));
  }

  async existsReport(userA: string, userB: string): Promise<boolean> {
    return this.reports.has(this.getKey(userA, userB));
  }

  async clear(): Promise<void> {
    this.reports.clear();
  }
}
