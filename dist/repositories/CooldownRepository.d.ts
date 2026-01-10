export declare class CooldownRepository {
    private cooldowns;
    setCooldownUntil(userId: string, date: Date | string): Promise<void>;
    isInCooldown(userId: string, now: Date): Promise<boolean>;
    getCooldownUntil(userId: string): Promise<Date | null>;
    deleteByUserId(userId: string): Promise<void>;
}
//# sourceMappingURL=CooldownRepository.d.ts.map