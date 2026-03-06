import type { Event } from "@/lib/db/types";

/**
 * Start of day in local time (00:00:00.000).
 */
function startOfDay(y: number, m: number, d: number): Date {
  return new Date(y, m, d, 0, 0, 0, 0);
}

/**
 * End of day in local time (23:59:59.999).
 */
function endOfDay(y: number, m: number, d: number): Date {
  return new Date(y, m, d, 23, 59, 59, 999);
}

/**
 * Whether an event overlaps a given calendar day (local date).
 * All-day events are matched by calendar date only so they don't spill to the next day
 * when the stored end (e.g. 23:59:59 local as UTC) is parsed back and lands on the next day.
 */
function eventOverlapsDay(event: Event, y: number, m: number, day: number): boolean {
  if (event.allDay) {
    const startY = event.start.getFullYear();
    const startM = event.start.getMonth();
    const startD = event.start.getDate();
    let endY = event.end.getFullYear();
    let endM = event.end.getMonth();
    let endD = event.end.getDate();
    // If end resolved to the next calendar day but is early (e.g. 00:00–12:00), treat as same-day
    const nextDay = new Date(startY, startM, startD + 1);
    if (
      endY === nextDay.getFullYear() &&
      endM === nextDay.getMonth() &&
      endD === nextDay.getDate() &&
      event.end.getHours() < 12
    ) {
      endY = startY;
      endM = startM;
      endD = startD;
    }
    const dayTime = new Date(y, m, day).getTime();
    const startDayTime = new Date(startY, startM, startD).getTime();
    const endDayTime = new Date(endY, endM, endD).getTime();
    return dayTime >= startDayTime && dayTime <= endDayTime;
  }
  const dayStart = startOfDay(y, m, day).getTime();
  const dayEnd = endOfDay(y, m, day).getTime();
  const start = event.start.getTime();
  const end = event.end.getTime();
  return start <= dayEnd && end >= dayStart;
}

/**
 * Get events that overlap a given calendar day.
 */
export function getEventsForDay(
  events: Event[],
  year: number,
  month: number,
  day: number
): Event[] {
  return events.filter((e) => eventOverlapsDay(e, year, month, day));
}

/**
 * Get events for the visible month (for API range).
 */
export function getMonthRange(year: number, month: number): { from: Date; to: Date } {
  const from = new Date(year, month, 1, 0, 0, 0, 0);
  const to = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { from, to };
}
