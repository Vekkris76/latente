import { DayType, TimeBucket } from '../../domain/types/enums';
export declare function getDayType(date: Date): DayType;
export declare function getTimeBucketMidpoint(bucket: TimeBucket): string | null;
export declare function addDays(date: Date, days: number): Date;
export declare function addHours(date: Date, hours: number): Date;
export declare function formatDate(date: Date): string;
export declare function clampTime(time: string): string;
//# sourceMappingURL=dateUtils.d.ts.map