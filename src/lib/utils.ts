import { subDays, format } from 'date-fns';

export function generate365DayGrid(): string[] {
  const today = new Date();
  const days: string[] = [];
  for (let i = 364; i >= 0; i--) {
    days.push(format(subDays(today, i), 'yyyy-MM-dd'));
  }
  return days;
}

export function getLeadingEmptyCells(days: string[]): number {
  const firstDay = new Date(days[0] + 'T12:00:00');
  return firstDay.getDay(); // 0=Sun, 1=Mon, ...
}
