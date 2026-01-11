import { DayType, TimeBucket } from '../../domain/types/enums';

export function getDayType(date: Date): DayType {
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;
  // TODO: holiday no puede inferirse sin calendario
  return isWeekend ? DayType.WEEKEND : DayType.WEEKDAY;
}

export function getTimeBucketMidpoint(bucket: TimeBucket): string | null {
  switch (bucket) {
    case TimeBucket.MORNING:
      return '09:00';
    case TimeBucket.MIDDAY:
      // TODO: midday según catálogo, pero NO inventes rango si no está en doc.
      // El doc 04 dice afternoon 12-18 -> 15:00. 
      // Si midday existe en catálogo pero no en doc de rangos, TODO.
      return null;
    case TimeBucket.AFTERNOON:
      return '15:00';
    case TimeBucket.EVENING:
      return '20:00';
    case TimeBucket.NIGHT:
      // TODO: night existe en catálogo pero el doc de rangos no lo define claramente
      return null;
    default:
      return null;
  }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function clampTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  if (hours < 8) return '08:00';
  if (hours > 22 || (hours === 22 && minutes > 0)) return '22:00';
  return time;
}
