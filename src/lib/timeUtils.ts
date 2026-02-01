import { BUSINESS_CONFIG } from '@/types/barbershop';

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getOpenRangeForDate(date: Date) {
  const dayOfWeek = date.getDay();
  const hours = BUSINESS_CONFIG.openingHours[dayOfWeek];
  
  if (!hours) return null;
  
  return {
    startMin: timeToMinutes(hours.start),
    endMin: timeToMinutes(hours.end),
    dayKey: dayOfWeek,
  };
}

export function isInBreak(dayKey: number, time: string): boolean {
  const breaks = BUSINESS_CONFIG.breaks[dayKey] || [];
  const minutes = timeToMinutes(time);
  
  return breaks.some(b => {
    const breakStart = timeToMinutes(b.start);
    const breakEnd = timeToMinutes(b.end);
    return minutes >= breakStart && minutes < breakEnd;
  });
}

export function isPastTime(date: Date, time: string): boolean {
  const now = new Date();
  const checkDate = new Date(date);
  const [h, m] = time.split(':').map(Number);
  checkDate.setHours(h, m, 0, 0);
  return checkDate < now;
}

export interface TimeSlot {
  time: string;
  status: 'available' | 'busy' | 'past' | 'break';
}

export function buildTimeSlots(
  date: Date,
  durationMin: number,
  unavailableSlots: string[]
): TimeSlot[] {
  const range = getOpenRangeForDate(date);
  if (!range) return [];
  
  const slots: TimeSlot[] = [];
  const { startMin, endMin, dayKey } = range;
  
  for (let min = startMin; min + durationMin <= endMin; min += BUSINESS_CONFIG.slotMinutes) {
    const time = minutesToTime(min);
    let status: TimeSlot['status'] = 'available';
    
    if (unavailableSlots.includes(time)) {
      status = 'busy';
    } else if (isInBreak(dayKey, time)) {
      status = 'break';
    } else if (isPastTime(date, time)) {
      status = 'past';
    }
    
    slots.push({ time, status });
  }
  
  return slots;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function formatTime(time: string): string {
  return time.replace(':', 'h');
}

export function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
